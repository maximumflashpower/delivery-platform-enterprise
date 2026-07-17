import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ClaimStatusLog } from '../entities/claim-status-log.entity';

@Injectable()
export class ClaimStatusLogService {
  private readonly logger = new Logger(ClaimStatusLogService.name);

  constructor(
    @InjectRepository(ClaimStatusLog)
    private readonly statusLogRepo: Repository<ClaimStatusLog>,
  ) {}

  async findAll(): Promise<ClaimStatusLog[]> {
    return this.statusLogRepo.find({ where: { deletedAt: IsNull() }, relations: ['claim'], order: { changedAt: 'DESC' } });
  }

  async findById(id: string): Promise<ClaimStatusLog> {
    const l = await this.statusLogRepo.findOne({ where: { id, deletedAt: IsNull() }, relations: ['claim'] });
    if (!l) throw new NotFoundException(`Status log with ID ${id} not found`);
    return l;
  }

  async findByClaimId(claimId: string): Promise<ClaimStatusLog[]> {
    return this.statusLogRepo.find({ 
      where: { claimId, deletedAt: IsNull() }, 
      relations: ['claim'],
      order: { changedAt: 'ASC' }
    });
  }

  async create(data: Partial<ClaimStatusLog>): Promise<ClaimStatusLog> {
    if (!data.claimId || !data.previousStatus || !data.newStatus) {
      throw new BadRequestException('claimId, previousStatus, and newStatus are required');
    }
    const log = this.statusLogRepo.create(data);
    log.changedAt = new Date();
    return this.statusLogRepo.save(log);
  }
}
