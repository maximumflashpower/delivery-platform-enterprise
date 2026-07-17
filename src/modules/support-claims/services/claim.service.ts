import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Claim } from '../entities/claim.entity';
import { ClaimStatus } from '../enums/claim-status.enum';
import { ClaimPriority } from '../enums/claim-priority.enum';

@Injectable()
export class ClaimService {
  private readonly logger = new Logger(ClaimService.name);

  constructor(
    @InjectRepository(Claim)
    private readonly claimRepo: Repository<Claim>,
  ) {}

  async findAll(): Promise<Claim[]> {
    return this.claimRepo.find({ where: { deletedAt: IsNull() }, relations: ['tickets', 'statusLogs'], order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Claim> {
    const c = await this.claimRepo.findOne({ where: { id, deletedAt: IsNull() }, relations: ['tickets', 'statusLogs'] });
    if (!c) throw new NotFoundException(`Claim with ID ${id} not found`);
    return c;
  }

  async findByUserId(userId: string): Promise<Claim[]> {
    return this.claimRepo.find({ where: { userId, deletedAt: IsNull() }, relations: ['tickets'], order: { createdAt: 'DESC' } });
  }

  async create(data: Partial<Claim>): Promise<Claim> {
    if (!data.claimNumber || !data.subject || !data.description) {
      throw new BadRequestException('claimNumber, subject, and description are required');
    }
    const c = this.claimRepo.create(data);
    c.openedAt = new Date();
    return this.claimRepo.save(c);
  }

  async update(id: string, data: Partial<Claim>): Promise<Claim> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.claimRepo.update(id, data);
    return this.findById(id);
  }

  async assignTo(id: string, userId: string): Promise<Claim> {
    const c = await this.findById(id);
    c.assignedToUserId = userId;
    if (c.status === ClaimStatus.OPEN) c.status = ClaimStatus.IN_PROGRESS;
    return this.claimRepo.save(c);
  }

  async resolve(id: string, resolutionNotes: string): Promise<Claim> {
    const c = await this.findById(id);
    c.status = ClaimStatus.RESOLVED;
    c.resolutionNotes = resolutionNotes;
    c.resolvedAt = new Date();
    return this.claimRepo.save(c);
  }

  async close(id: string): Promise<Claim> {
    const c = await this.findById(id);
    c.status = ClaimStatus.CLOSED;
    return this.claimRepo.save(c);
  }

  async reopen(id: string): Promise<Claim> {
    const c = await this.findById(id);
    c.status = ClaimStatus.REOPENED;
    c.resolvedAt = undefined;
    return this.claimRepo.save(c);
  }

  async escalate(id: string, newPriority: ClaimPriority): Promise<Claim> {
    const c = await this.findById(id);
    c.priority = newPriority;
    return this.claimRepo.save(c);
  }
}
