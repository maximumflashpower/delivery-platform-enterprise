import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MilestoneEscrow, EscrowStatus, MilestoneStatus } from '../entities/milestone-escrow.entity';
import { CreateEscrowDto, FundEscrowDto, SubmitMilestoneDto, ApproveMilestoneDto, RejectMilestoneDto, RaiseDisputeDto, ResolveDisputeDto } from '../dto/milestone-escrow.dto';

@Injectable()
export class MilestoneEscrowService {
  private readonly logger = new Logger(MilestoneEscrowService.name);

  constructor(
    @InjectRepository(MilestoneEscrow)
    private readonly repo: Repository<MilestoneEscrow>,
  ) {}

  async create(dto: CreateEscrowDto): Promise<MilestoneEscrow> {
    // Validate total matches sum of milestones
    const milestoneTotal = dto.milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
    if (Math.abs(milestoneTotal - dto.totalAmount) > 0.01) {
      throw new BadRequestException(`Milestone amounts (${milestoneTotal}) do not match total (${dto.totalAmount})`);
    }

    const escrow = this.repo.create({
      ...dto,
      status: EscrowStatus.INITIATED,
      amountHeld: dto.totalAmount,
      amountReleased: 0,
      amountRefunded: 0,
    });
    return this.repo.save(escrow);
  }

  async fund(id: string, dto: FundEscrowDto): Promise<MilestoneEscrow> {
    const escrow = await this.findOne(id);
    escrow.status = EscrowStatus.FUNDED;
    escrow.paymentMethod = dto.paymentMethod;
    escrow.fundedAt = new Date();
    this.logger.log(`Escrow funded: ${id} (${escrow.currency} ${escrow.totalAmount})`);
    return this.repo.save(escrow);
  }

  async submitMilestone(id: string, dto: SubmitMilestoneDto): Promise<MilestoneEscrow> {
    const escrow = await this.findOne(id);
    const milestone = escrow.milestones.find((m: any) => m.id === dto.milestoneId);
    if (!milestone) throw new NotFoundException(`Milestone ${dto.milestoneId} not found`);
    
    milestone.status = MilestoneStatus.SUBMITTED;
    milestone.submittedAt = new Date();
    milestone.description = dto.description;
    milestone.deliverables = dto.deliverables;
    
    return this.repo.save(escrow);
  }

  async approveMilestone(id: string, dto: ApproveMilestoneDto): Promise<MilestoneEscrow> {
    const escrow = await this.findOne(id);
    const milestone = escrow.milestones.find((m: any) => m.id === dto.milestoneId);
    if (!milestone) throw new NotFoundException(`Milestone ${dto.milestoneId} not found`);

    milestone.status = MilestoneStatus.APPROVED;
    milestone.approvedAt = new Date();
    milestone.releaseAmount = dto.releaseAmount;

    escrow.amountReleased = (parseFloat(escrow.amountReleased.toString()) + dto.releaseAmount);
    escrow.amountHeld = (parseFloat(escrow.amountHeld.toString()) - dto.releaseAmount);

    if (escrow.amountHeld <= 0.01) {
      escrow.status = EscrowStatus.COMPLETED;
      escrow.completedAt = new Date();
    } else {
      escrow.status = EscrowStatus.PARTIALLY_RELEASED;
    }

    this.logger.warn(`Milestone approved: ${dto.milestoneId}, releasing ${dto.releaseAmount}`);
    return this.repo.save(escrow);
  }

  async rejectMilestone(id: string, dto: RejectMilestoneDto): Promise<MilestoneEscrow> {
    const escrow = await this.findOne(id);
    const milestone = escrow.milestones.find((m: any) => m.id === dto.milestoneId);
    if (!milestone) throw new NotFoundException(`Milestone ${dto.milestoneId} not found`);

    milestone.status = MilestoneStatus.REJECTED;
    milestone.rejectionReason = dto.rejectionReason;
    milestone.rejectedAt = new Date();

    return this.repo.save(escrow);
  }

  async raiseDispute(id: string, dto: RaiseDisputeDto): Promise<MilestoneEscrow> {
    const escrow = await this.findOne(id);
    escrow.status = EscrowStatus.DISPUTED;
    escrow.disputeRaisedBy = dto.raisedBy;
    escrow.disputeReason = dto.reason;
    escrow.disputedAt = new Date();
    this.logger.error(`Dispute raised for escrow ${id}: ${dto.reason}`);
    return this.repo.save(escrow);
  }

  async resolveDispute(id: string, dto: ResolveDisputeDto): Promise<MilestoneEscrow> {
    const escrow = await this.findOne(id);
    
    switch (dto.resolution) {
      case 'sponsor_wins':
        escrow.amountRefunded = dto.settlementAmount;
        escrow.amountReleased = (parseFloat(escrow.amountReleased.toString()) - dto.settlementAmount);
        break;
      case 'recipient_wins':
        escrow.amountReleased = parseFloat(escrow.amountReleased.toString()) + dto.settlementAmount;
        escrow.amountHeld = (parseFloat(escrow.amountHeld.toString()) - dto.settlementAmount);
        break;
      case 'partial':
        escrow.amountReleased = (parseFloat(escrow.amountReleased.toString()) + dto.settlementAmount / 2);
        escrow.amountRefunded = dto.settlementAmount / 2;
        break;
      case 'refunded':
        escrow.amountRefunded = dto.settlementAmount;
        escrow.amountHeld = 0;
        break;
    }

    escrow.status = EscrowStatus.COMPLETED;
    escrow.completedAt = new Date();
    
    this.logger.log(`Dispute resolved: ${id} - ${dto.resolution}`);
    return this.repo.save(escrow);
  }

  async refundPartial(id: string, amount: number): Promise<MilestoneEscrow> {
    const escrow = await this.findOne(id);
    escrow.amountRefunded = (parseFloat(escrow.amountRefunded.toString()) + amount);
    escrow.amountHeld = (parseFloat(escrow.amountHeld.toString()) - amount);
    if (parseFloat(escrow.amountHeld.toString()) <= 0) {
      escrow.status = EscrowStatus.REFUNDED;
    } else {
      escrow.status = EscrowStatus.PARTIALLY_RELEASED;
    }
    return this.repo.save(escrow);
  }

  async findOne(id: string): Promise<MilestoneEscrow> {
    const escrow = await this.repo.findOne({ where: { id } });
    if (!escrow) throw new NotFoundException(`Escrow ${id} not found`);
    return escrow;
  }

  async findAll(filters?: { status?: string; sponsorId?: string; recipientId?: string }): Promise<MilestoneEscrow[]> {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.sponsorId) where.sponsorId = filters.sponsorId;
    if (filters?.recipientId) where.recipientId = filters.recipientId;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async getStats(): Promise<{
    totalEscrows: number;
    active: number;
    completed: number;
    disputed: number;
    refunded: number;
    totalFunded: number;
    totalReleased: number;
    totalHeld: number;
    totalRefunded: number;
  }> {
    const all = await this.repo.find();
    return {
      totalEscrows: all.length,
      active: all.filter(e => [EscrowStatus.ACTIVE, EscrowStatus.MILESTONE_APPROVED].includes(e.status)).length,
      completed: all.filter(e => e.status === EscrowStatus.COMPLETED).length,
      disputed: all.filter(e => e.status === EscrowStatus.DISPUTED).length,
      refunded: all.filter(e => [EscrowStatus.REFUNDED, EscrowStatus.FUNDED].includes(e.status)).length,
      totalFunded: all.reduce((sum, e) => sum + e.totalAmount, 0),
      totalReleased: all.reduce((sum, e) => sum + parseFloat(e.amountReleased.toString()), 0),
      totalHeld: all.reduce((sum, e) => sum + parseFloat(e.amountHeld.toString()), 0),
      totalRefunded: all.reduce((sum, e) => sum + parseFloat(e.amountRefunded.toString()), 0),
    };
  }
}
