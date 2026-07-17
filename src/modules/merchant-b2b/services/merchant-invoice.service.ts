import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { MerchantInvoice } from '../entities/merchant-invoice.entity';
import { InvoiceStatus } from '../enums/invoice-status.enum';

@Injectable()
export class MerchantInvoiceService {
  private readonly logger = new Logger(MerchantInvoiceService.name);

  constructor(
    @InjectRepository(MerchantInvoice)
    private readonly invoiceRepo: Repository<MerchantInvoice>,
  ) {}

  async findAll(): Promise<MerchantInvoice[]> {
    return this.invoiceRepo.find({ where: { deletedAt: IsNull() }, relations: ['merchant'] });
  }

  async findByMerchantId(merchantId: string): Promise<MerchantInvoice[]> {
    return this.invoiceRepo.find({ 
      where: { merchantId, deletedAt: IsNull() }, 
      relations: ['merchant'],
      order: { issueDate: 'DESC' } 
    });
  }

  async findById(id: string): Promise<MerchantInvoice> {
    const invoice = await this.invoiceRepo.findOne({ 
      where: { id, deletedAt: IsNull() }, 
      relations: ['merchant'] 
    });
    if (!invoice) throw new NotFoundException(`Invoice with ID ${id} not found`);
    return invoice;
  }

  async create(data: Partial<MerchantInvoice>): Promise<MerchantInvoice> {
    const invoice = this.invoiceRepo.create(data);
    return this.invoiceRepo.save(invoice);
  }

  async pay(id: string): Promise<MerchantInvoice> {
    const invoice = await this.findById(id);
    invoice.status = InvoiceStatus.PAID;
    invoice.paidDate = new Date();
    return this.invoiceRepo.save(invoice);
  }

  async markOverdue(id: string): Promise<MerchantInvoice> {
    const invoice = await this.findById(id);
    invoice.status = InvoiceStatus.OVERDUE;
    return this.invoiceRepo.save(invoice);
  }

  async void(id: string): Promise<MerchantInvoice> {
    const invoice = await this.findById(id);
    invoice.status = InvoiceStatus.VOIDED;
    return this.invoiceRepo.save(invoice);
  }
}
