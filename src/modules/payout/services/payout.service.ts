import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payout } from '../entities/payout.entity';
import { PayoutMethod } from '../enums/payout-method.enum';
import { PayoutStatus } from '../enums/payout-status.enum';

@Injectable()
export class PayoutService {
  private readonly logger = new Logger(PayoutService.name);

  constructor(
    @InjectRepository(Payout)
    private readonly payoutRepo: Repository<Payout>,
  ) {}

  async createPayout(data: {
    payoutId: string;
    userId?: string;
    amount: number;
    currency: string;
    method: PayoutMethod;
    notes?: string;
  }): Promise<Payout> {
    const payout = this.payoutRepo.create({
      ...data,
      status: PayoutStatus.PENDING,
    });
    this.logger.log(`Payout ${data.payoutId} created for user ${data.userId || 'anonymous'}`);
    return this.payoutRepo.save(payout);
  }

  async findAllPayouts(where?: Partial<Payout>): Promise<Payout[]> {
    return this.payoutRepo.find({
      where: where || {},
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findPayoutById(id: string): Promise<Payout> {
    const payout = await this.payoutRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!payout) throw new NotFoundException('Payout not found');
    return payout;
  }

  async findPayoutByPayoutId(payoutId: string): Promise<Payout> {
    const payout = await this.payoutRepo.findOne({
      where: { payoutId },
      relations: { user: true },
    });
    if (!payout) throw new NotFoundException('Payout not found');
    return payout;
  }

  async findPayoutsByUser(userId: string): Promise<Payout[]> {
    return this.payoutRepo.find({
      where: { userId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findPayoutsByStatus(status: PayoutStatus): Promise<Payout[]> {
    return this.payoutRepo.find({
      where: { status },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async updatePayout(id: string, data: Partial<Payout>): Promise<Payout> {
    const payout = await this.findPayoutById(id);
    Object.assign(payout, data);
    return this.payoutRepo.save(payout);
  }

  async processPayout(id: string): Promise<Payout> {
    const payout = await this.findPayoutById(id);

    if (payout.status !== PayoutStatus.PENDING) {
      throw new BadRequestException(`Cannot process payout with status: ${payout.status}`);
    }

    payout.status = PayoutStatus.PROCESSING;
    this.logger.log(`Payout ${payout.payoutId} is now processing`);
    return this.payoutRepo.save(payout);
  }

  async completePayout(id: string): Promise<Payout> {
    const payout = await this.findPayoutById(id);

    if (payout.status !== PayoutStatus.PROCESSING) {
      throw new BadRequestException(`Cannot complete payout with status: ${payout.status}`);
    }

    payout.status = PayoutStatus.COMPLETED;
    this.logger.log(`Payout ${payout.payoutId} completed successfully`);
    return this.payoutRepo.save(payout);
  }

  async failPayout(id: string, reason?: string): Promise<Payout> {
    const payout = await this.findPayoutById(id);

    if (![PayoutStatus.PENDING, PayoutStatus.PROCESSING].includes(payout.status)) {
      throw new BadRequestException(`Cannot fail payout with status: ${payout.status}`);
    }

    payout.status = PayoutStatus.FAILED;
    if (reason) {
      payout.notes = `${payout.notes || ''}\nFailure reason: ${reason}`.trim();
    }
    this.logger.warn(`Payout ${payout.payoutId} failed${reason ? ': ' + reason : ''}`);
    return this.payoutRepo.save(payout);
  }

  async cancelPayout(id: string, reason?: string): Promise<Payout> {
    const payout = await this.findPayoutById(id);

    if (![PayoutStatus.PENDING, PayoutStatus.PROCESSING].includes(payout.status)) {
      throw new BadRequestException(`Cannot cancel payout with status: ${payout.status}`);
    }

    payout.status = PayoutStatus.CANCELLED;
    if (reason) {
      payout.notes = `${payout.notes || ''}\nCancellation reason: ${reason}`.trim();
    }
    this.logger.log(`Payout ${payout.payoutId} cancelled${reason ? ': ' + reason : ''}`);
    return this.payoutRepo.save(payout);
  }

  async getPayoutStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    cancelled: number;
    totalAmountCompleted: number;
  }> {
    const payouts = await this.payoutRepo.find();
    const stats = {
      total: payouts.length,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      totalAmountCompleted: 0,
    };

    for (const p of payouts) {
      switch (p.status) {
        case PayoutStatus.PENDING:
          stats.pending++;
          break;
        case PayoutStatus.PROCESSING:
          stats.processing++;
          break;
        case PayoutStatus.COMPLETED:
          stats.completed++;
          stats.totalAmountCompleted += p.amount;
          break;
        case PayoutStatus.FAILED:
          stats.failed++;
          break;
        case PayoutStatus.CANCELLED:
          stats.cancelled++;
          break;
      }
    }

    return stats;
  }
}
