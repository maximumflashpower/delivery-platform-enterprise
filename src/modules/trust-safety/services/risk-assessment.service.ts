import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RiskAssessment, RiskStatus } from '../entities/risk-assessment.entity';

@Injectable()
export class RiskAssessmentService {
  constructor(
    @InjectRepository(RiskAssessment)
    private readonly repo: Repository<RiskAssessment>,
  ) {}

  async create(data: Partial<RiskAssessment>): Promise<RiskAssessment> {
    return this.repo.save(this.repo.create(data));
  }

  async findAll(): Promise<RiskAssessment[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<RiskAssessment> {
    const risk = await this.repo.findOne({ where: { id } });
    if (!risk) throw new NotFoundException(`RiskAssessment ${id} not found`);
    return risk;
  }

  async update(id: string, updates: Partial<RiskAssessment>): Promise<RiskAssessment> {
    const risk = await this.findOne(id);
    Object.assign(risk, updates);
    return this.repo.save(risk);
  }

  async remove(id: string): Promise<void> {
    const risk = await this.findOne(id);
    await this.repo.remove(risk);
  }

  async assess(id: string, assessedBy: string, level: string): Promise<RiskAssessment> {
    const risk = await this.findOne(id);
    risk.status = RiskStatus.ASSESSED;
    risk.assessedBy = assessedBy;
    risk.risk_level = level as any;
    risk.reviewed_at = new Date();
    return this.repo.save(risk);
  }

  async mitigate(id: string, plan: string): Promise<RiskAssessment> {
    const risk = await this.findOne(id);
    risk.status = RiskStatus.MITIGATED;
    risk.mitigation_plan = plan;
    return this.repo.save(risk);
  }

  async escalate(id: string): Promise<RiskAssessment> {
    const risk = await this.findOne(id);
    risk.status = RiskStatus.ESCALATED;
    return this.repo.save(risk);
  }

  async accept(id: string, acceptedBy: string): Promise<RiskAssessment> {
    const risk = await this.findOne(id);
    risk.status = RiskStatus.ACCEPTED;
    risk.assessedBy = acceptedBy;
    return this.repo.save(risk);
  }
}
