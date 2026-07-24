import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbuseSimulation, SimulationStatus } from '../entities/abuse-simulation.entity';
import { CreateSimulationDto, UpdateSimulationStatusDto, ExecuteSimulationDto } from '../dto/abuse-simulation.dto';

@Injectable()
export class AbuseSimulationService {
  private readonly logger = new Logger(AbuseSimulationService.name);

  constructor(
    @InjectRepository(AbuseSimulation)
    private readonly repo: Repository<AbuseSimulation>,
  ) {}

  async create(dto: CreateSimulationDto): Promise<AbuseSimulation> {
    const simulation = this.repo.create({
      ...dto,
      status: SimulationStatus.SCHEDULED,
      successfulAttacks: 0,
      blockedAttacks: 0,
    });
    return this.repo.save(simulation);
  }

  async findAll(filters?: { status?: string; type?: string }): Promise<AbuseSimulation[]> {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.type) where.simulationType = filters.type;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<AbuseSimulation> {
    const sim = await this.repo.findOne({ where: { id } });
    if (!sim) throw new NotFoundException(`Simulation ${id} not found`);
    return sim;
  }

  async schedule(id: string): Promise<AbuseSimulation> {
    const sim = await this.findOne(id);
    sim.status = SimulationStatus.SCHEDULED;
    sim.scheduledAt = new Date();
    return this.repo.save(sim);
  }

  async start(id: string): Promise<AbuseSimulation> {
    const sim = await this.findOne(id);
    sim.status = SimulationStatus.RUNNING;
    sim.startedAt = new Date();
    sim.executedRequests = 0;
    return this.repo.save(sim);
  }

  async updateProgress(id: string, progress: { executedRequests: number; successfulAttacks?: number; blockedAttacks?: number }): Promise<AbuseSimulation> {
    const sim = await this.findOne(id);
    Object.assign(sim, progress);
    if (progress.successfulAttacks !== undefined && progress.blockedAttacks !== undefined) {
      const total = progress.successfulAttacks + progress.blockedAttacks;
      sim.successRate = total > 0 ? progress.successfulAttacks / total : 0;
    }
    return this.repo.save(sim);
  }

  async complete(id: string, findings: string, recommendations: string): Promise<AbuseSimulation> {
    const sim = await this.findOne(id);
    sim.status = SimulationStatus.COMPLETED;
    sim.completedAt = new Date();
    sim.findings = findings;
    sim.recommendations = recommendations;
    return this.repo.save(sim);
  }

  async fail(id: string, error: string): Promise<AbuseSimulation> {
    const sim = await this.findOne(id);
    sim.status = SimulationStatus.FAILED;
    sim.completedAt = new Date();
    sim.findings = `Failed: ${error}`;
    return this.repo.save(sim);
  }

  async cancel(id: string): Promise<AbuseSimulation> {
    const sim = await this.findOne(id);
    sim.status = SimulationStatus.CANCELLED;
    sim.completedAt = new Date();
    return this.repo.save(sim);
  }

  async getStats(): Promise<{
    totalSimulations: number;
    running: number;
    completed: number;
    failed: number;
    byType: Record<string, number>;
  }> {
    const all = await this.repo.find();
    const byType: Record<string, number> = {};
    all.forEach(s => {
      byType[s.simulationType] = (byType[s.simulationType] || 0) + 1;
    });

    return {
      totalSimulations: all.length,
      running: all.filter(s => s.status === SimulationStatus.RUNNING).length,
      completed: all.filter(s => s.status === SimulationStatus.COMPLETED).length,
      failed: all.filter(s => s.status === SimulationStatus.FAILED).length,
      byType,
    };
  }
}
