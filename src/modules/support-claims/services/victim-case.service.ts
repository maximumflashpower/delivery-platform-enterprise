import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { VictimSupportCase } from '../entities/victim-support-case.entity';
import { CreateVictimCaseDto } from '../dto/create-victim-case.dto';

@Injectable()
export class VictimCaseService {
  constructor(
    @InjectRepository(VictimSupportCase)
    private readonly repo: Repository<VictimSupportCase>,
  ) {}

  async create(dto: CreateVictimCaseDto): Promise<VictimSupportCase> {
    const vc = new VictimSupportCase();
    vc.userId = dto.userId;
    vc.caseType = dto.caseType as any;
    vc.description = dto.description;
    vc.isUrgent = dto.isUrgent ?? false;
    vc.status = 'open';
    vc.safetyPlan = dto.safetyPlan || '';
    vc.evidenceReferences = dto.evidenceReferences || '';
    vc.externalActions = '';
    return this.repo.save(vc);
  }

  async findByUser(userId: string): Promise<VictimSupportCase[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getActiveCases(): Promise<VictimSupportCase[]> {
    return this.repo.find({
      where: { status: In(['open', 'assigned', 'in_progress']) },
      order: { isUrgent: 'DESC', createdAt: 'ASC' },
    });
  }

  async getUrgentCases(): Promise<VictimSupportCase[]> {
    return this.repo.find({
      where: { isUrgent: true, status: In(['open', 'assigned', 'in_progress']) },
      order: { createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<VictimSupportCase> {
    const vc = await this.repo.findOne({ where: { id } });
    if (!vc) throw new NotFoundException(`Support case ${id} not found`);
    return vc;
  }

  async assign(id: string, agentId: string): Promise<VictimSupportCase> {
    const vc = await this.findById(id);
    vc.status = 'assigned';
    vc.assignedSupportAgent = agentId;
    vc.updatedAt = new Date();
    return this.repo.save(vc);
  }

  async updateSafetyPlan(id: string, plan: string): Promise<VictimSupportCase> {
    const vc = await this.findById(id);
    vc.safetyPlan = plan;
    vc.updatedAt = new Date();
    return this.repo.save(vc);
  }

  async addExternalAction(id: string, action: string): Promise<VictimSupportCase> {
    const vc = await this.findById(id);
    const actions = vc.externalActions ? `${vc.externalActions}\n\n` : '';
    vc.externalActions = `${actions}${new Date().toISOString()}: ${action}`;
    vc.updatedAt = new Date();
    return this.repo.save(vc);
  }

  async close(id: string, reason: string): Promise<VictimSupportCase> {
    const vc = await this.findById(id);
    if (vc.status === 'closed') {
      throw new BadRequestException('Case is already closed');
    }
    vc.status = 'closed';
    vc.closedAt = new Date();
    vc.closureReason = reason;
    vc.updatedAt = new Date();
    return this.repo.save(vc);
  }

  async getStats(): Promise<{ open: number; urgent: number; assigned: number; resolved_today: number }> {
    const open = await this.repo.count({ where: { status: 'open' } });
    const urgent = await this.repo.count({ where: { isUrgent: true, status: In(['open', 'assigned', 'in_progress']) } });
    const assigned = await this.repo.count({ where: { status: 'assigned' } });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resolved_today = await this.repo.count({ where: { status: 'resolved',  } });
    return { open, urgent, assigned, resolved_today };
  }
}
