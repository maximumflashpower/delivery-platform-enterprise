import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReleaseGate, GateStatus } from '../entities/release-gate.entity';

@Injectable()
export class ReleaseGateService {
  constructor(
    @InjectRepository(ReleaseGate)
    private readonly releaseGateRepo: Repository<ReleaseGate>,
  ) {}

  async create(gateData: Partial<ReleaseGate>): Promise<ReleaseGate> {
    const gate = this.releaseGateRepo.create(gateData);
    return this.releaseGateRepo.save(gate);
  }

  async findAll(): Promise<ReleaseGate[]> {
    return this.releaseGateRepo.find({ relations: ['owner'] });
  }

  async findOne(id: string): Promise<ReleaseGate> {
    const gate = await this.releaseGateRepo.findOne({ where: { id }, relations: ['owner'] });
    if (!gate) throw new NotFoundException(`ReleaseGate ${id} not found`);
    return gate;
  }

  async update(id: string, updates: Partial<ReleaseGate>): Promise<ReleaseGate> {
    const gate = await this.findOne(id);
    Object.assign(gate, updates);
    return this.releaseGateRepo.save(gate);
  }

  async remove(id: string): Promise<void> {
    const gate = await this.findOne(id);
    await this.releaseGateRepo.remove(gate);
  }

  async approve(id: string, approverId: string): Promise<ReleaseGate> {
    const gate = await this.findOne(id);
    
    if (gate.status !== GateStatus.PENDING) {
      throw new ForbiddenException(`Cannot approve gate with status ${gate.status}`);
    }

    gate.status = GateStatus.APPROVED;
    gate.approved_by = approverId;
    gate.approved_at = new Date();
    
    return this.releaseGateRepo.save(gate);
  }

  async reject(id: string, rejectorId: string, reason?: string): Promise<ReleaseGate> {
    const gate = await this.findOne(id);
    
    if (gate.status !== GateStatus.PENDING) {
      throw new ForbiddenException(`Cannot reject gate with status ${gate.status}`);
    }

    gate.status = GateStatus.REJECTED;
    // Note: reason could be stored in audit_log instead
    
    return this.releaseGateRepo.save(gate);
  }

  async rollback(id: string, rollBackBy: string): Promise<ReleaseGate> {
    const gate = await this.findOne(id);
    
    if (gate.status !== GateStatus.APPROVED) {
      throw new ForbiddenException(`Cannot rollback gate with status ${gate.status}`);
    }

    gate.status = GateStatus.ROLLED_BACK;
    return this.releaseGateRepo.save(gate);
  }
}
