import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SponsorInvoice, InvoiceStatus, ComplianceStatus } from '../entities/sponsor-invoice.entity';
import { CreateSponsorInvoiceDto, UpdateInvoiceStatusDto, MarkPaidDto, SubmitDisputeDto, RunComplianceCheckDto } from '../dto/sponsor-invoice.dto';

@Injectable()
export class SponsorInvoiceService {
  private readonly logger = new Logger(SponsorInvoiceService.name);

  constructor(
    @InjectRepository(SponsorInvoice)
    private readonly repo: Repository<SponsorInvoice>,
  ) {}

  async generateInvoiceNumber(): Promise<string> {
    const today = new Date();
    const yearMonth = today.toISOString().slice(0, 7).replace('-', '');
    const count = await this.repo.count({ where: { issueDate:today }});
    return `INV-${yearMonth}-${String(count + 1).padStart(4, '0')}`;
  }

  async create(dto: CreateSponsorInvoiceDto): Promise<SponsorInvoice> {
    const invoiceNumber = await this.generateInvoiceNumber();
    const subtotal = dto.subtotal;
    const taxAmount = dto.taxAmount || 0;
    const discountAmount = dto.discountAmount || 0;
    const totalAmount = subtotal + taxAmount - discountAmount;

    const invoice = this.repo.create({
      ...dto,
      invoiceNumber,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      status: InvoiceStatus.DRAFT,
      complianceStatus: ComplianceStatus.PENDING_REVIEW,
    });
    const saved = await this.repo.save(invoice);
    this.logger.log(`Invoice created: ${saved.invoiceNumber} for ${dto.sponsorName} (${saved.totalAmount} ${saved.currency})`);
    return saved;
  }

  async findAll(filters?: { status?: string; complianceStatus?: string; sponsorId?: string; merchantId?: string }): Promise<SponsorInvoice[]> {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.complianceStatus) where.complianceStatus = filters.complianceStatus;
    if (filters?.sponsorId) where.sponsorId = filters.sponsorId;
    if (filters?.merchantId) where.merchantId = filters.merchantId;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<SponsorInvoice> {
    const invoice = await this.repo.findOne({ where: { id } });
    if (!invoice) throw new NotFoundException(`Invoice ${id} not found`);
    return invoice;
  }

  async send(id: string): Promise<SponsorInvoice> {
    const invoice = await this.findOne(id);
    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException(`Cannot send invoice in status ${invoice.status}`);
    }
    invoice.status = InvoiceStatus.SENT;
    invoice.sentAt = new Date();
    return this.repo.save(invoice);
  }

  async updateStatus(id: string, dto: UpdateInvoiceStatusDto): Promise<SponsorInvoice> {
    const invoice = await this.findOne(id);
    invoice.status = dto.status;
    if (dto.notes) invoice.notes = dto.notes;
    
    if (dto.status === InvoiceStatus.OVERDUE) {
      this.logger.warn(`Invoice overdue: ${invoice.invoiceNumber}`);
    }
    return this.repo.save(invoice);
  }

  async markPaid(id: string, dto: MarkPaidDto): Promise<SponsorInvoice> {
    const invoice = await this.findOne(id);
    invoice.status = InvoiceStatus.PAID;
    invoice.paidAt = new Date();
    if (dto.paymentReference) invoice.notes = `${invoice.notes || ''}\nPayment ref: ${dto.paymentReference}`;
    this.logger.log(`Invoice paid: ${invoice.invoiceNumber}`);
    return this.repo.save(invoice);
  }

  async submitDispute(id: string, dto: SubmitDisputeDto): Promise<SponsorInvoice> {
    const invoice = await this.findOne(id);
    invoice.status = InvoiceStatus.DISPUTED;
    invoice.disputedAt = new Date();
    invoice.disputeReason = dto.reason;
    this.logger.error(`Invoice disputed: ${invoice.invoiceNumber} - ${dto.reason}`);
    return this.repo.save(invoice);
  }

  async cancel(id: string): Promise<SponsorInvoice> {
    const invoice = await this.findOne(id);
    if ([InvoiceStatus.PAID, InvoiceStatus.OVERDUE].includes(invoice.status)) {
      throw new BadRequestException(`Cannot cancel invoice in status ${invoice.status}`);
    }
    invoice.status = InvoiceStatus.CANCELLED;
    return this.repo.save(invoice);
  }

  async runComplianceCheck(id: string, dto: RunComplianceCheckDto): Promise<SponsorInvoice> {
    const invoice = await this.findOne(id);
    invoice.complianceStatus = dto.complianceStatus;
    
    if (dto.complianceChecks) {
      invoice.complianceChecks = dto.complianceChecks;
    }
    
    if (dto.complianceStatus === ComplianceStatus.COMPLIANT) {
      invoice.compliantAt = new Date();
      invoice.approvedBy = dto.approvedBy ?? null;
    }
    
    this.logger.log(`Compliance check: ${invoice.invoiceNumber} -> ${dto.complianceStatus}`);
    return this.repo.save(invoice);
  }

  async addLineItem(id: string, item: Record<string, any>): Promise<SponsorInvoice> {
    const invoice = await this.findOne(id);
    const items = invoice.lineItems || [];
    items.push(item);
    invoice.lineItems = items;
    
    // Recalculate totals
    const lineTotal = items.reduce((sum: number, i: any) => sum + (i.quantity * i.unitPrice), 0);
    invoice.subtotal = lineTotal;
    invoice.totalAmount = lineTotal + invoice.taxAmount - invoice.discountAmount;
    
    return this.repo.save(invoice);
  }

  async getStats(): Promise<{
    totalInvoices: number;
    draft: number;
    pending: number;
    sent: number;
    paid: number;
    overdue: number;
    disputed: number;
    cancelled: number;
    compliant: number;
    nonCompliant: number;
    totalRevenue: number;
    outstandingAmount: number;
  }> {
    const all = await this.repo.find();
    return {
      totalInvoices: all.length,
      draft: all.filter(i => i.status === InvoiceStatus.DRAFT).length,
      pending: all.filter(i => i.status === InvoiceStatus.PENDING).length,
      sent: all.filter(i => i.status === InvoiceStatus.SENT).length,
      paid: all.filter(i => i.status === InvoiceStatus.PAID).length,
      overdue: all.filter(i => i.status === InvoiceStatus.OVERDUE).length,
      disputed: all.filter(i => i.status === InvoiceStatus.DISPUTED).length,
      cancelled: all.filter(i => i.status === InvoiceStatus.CANCELLED).length,
      compliant: all.filter(i => i.complianceStatus === ComplianceStatus.COMPLIANT).length,
      nonCompliant: all.filter(i => i.complianceStatus === ComplianceStatus.NON_COMPLIANT).length,
      totalRevenue: all.filter(i => i.status === InvoiceStatus.PAID).reduce((sum, i) => sum + i.totalAmount, 0),
      outstandingAmount: all.filter(i => [InvoiceStatus.PENDING, InvoiceStatus.SENT].includes(i.status)).reduce((sum, i) => sum + i.totalAmount, 0),
    };
  }
}
