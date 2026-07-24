import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemicRiskIndicator, IndicatorStatus, IndicatorSeverity } from '../entities/systemic-risk-indicator.entity';
import { RiskCorrelation } from '../entities/risk-correlation.entity';
import { RiskIncident, IncidentStatus } from '../entities/risk-incident.entity';
import { CreateIndicatorDto, UpdateIndicatorDto, CreateCorrelationDto, CreateIncidentDto, ResolveIncidentDto } from '../dto/systemic-risk.dto';

@Injectable()
export class SystemicRiskService {
  private readonly logger = new Logger(SystemicRiskService.name);

  constructor(
    @InjectRepository(SystemicRiskIndicator)
    private readonly indicatorRepo: Repository<SystemicRiskIndicator>,
    @InjectRepository(RiskCorrelation)
    private readonly correlationRepo: Repository<RiskCorrelation>,
    @InjectRepository(RiskIncident)
    private readonly incidentRepo: Repository<RiskIncident>,
  ) {}

  // ═══ INDICATORS ═══

  async createIndicator(dto: CreateIndicatorDto): Promise<SystemicRiskIndicator> {
    const indicator = this.indicatorRepo.create({
      ...dto,
      status: IndicatorStatus.ACTIVE,
      lastMeasuredAt: new Date(),
    });
    const saved = await this.indicatorRepo.save(indicator);
    this.logger.log(`Risk indicator created: ${saved.id} (${saved.indicatorName})`);
    return saved;
  }

  async findAllIndicators(filters?: { category?: string; severity?: string; status?: string }): Promise<SystemicRiskIndicator[]> {
    const where: any = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.severity) where.severity = filters.severity;
    if (filters?.status) where.status = filters.status;
    return this.indicatorRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findIndicatorById(id: string): Promise<SystemicRiskIndicator> {
    const indicator = await this.indicatorRepo.findOne({ where: { id } });
    if (!indicator) throw new NotFoundException(`Indicator ${id} not found`);
    return indicator;
  }

  async updateIndicator(id: string, dto: UpdateIndicatorDto): Promise<SystemicRiskIndicator> {
    const indicator = await this.findIndicatorById(id);
    if (dto.currentValue !== undefined) {
      indicator.previousValue = indicator.currentValue;
      indicator.lastMeasuredAt = new Date();
    }
    Object.assign(indicator, dto);
    return this.indicatorRepo.save(indicator);
  }

  async acknowledgeIndicator(id: string): Promise<SystemicRiskIndicator> {
    const indicator = await this.findIndicatorById(id);
    indicator.status = IndicatorStatus.ACKNOWLEDGED;
    return this.indicatorRepo.save(indicator);
  }

  async resolveIndicator(id: string, mitigationPlan: string): Promise<SystemicRiskIndicator> {
    const indicator = await this.findIndicatorById(id);
    indicator.status = IndicatorStatus.RESOLVED;
    indicator.mitigationPlan = mitigationPlan;
    return this.indicatorRepo.save(indicator);
  }

  // ═══ CORRELATIONS ═══

  async createCorrelation(dto: CreateCorrelationDto): Promise<RiskCorrelation> {
    const correlation = this.correlationRepo.create({
      ...dto,
      analyzedAt: new Date(),
    });
    return this.correlationRepo.save(correlation);
  }

  async findCorrelationsByIndicator(indicatorId: string): Promise<RiskCorrelation[]> {
    return this.correlationRepo.find({
      where: [{ indicatorAId: indicatorId }, { indicatorBId: indicatorId }],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllCorrelations(): Promise<RiskCorrelation[]> {
    return this.correlationRepo.find({ order: { createdAt: 'DESC' } });
  }

  // ═══ INCIDENTS ═══

  async createIncident(dto: CreateIncidentDto): Promise<RiskIncident> {
    const incident = this.incidentRepo.create({
      ...dto,
      status: IncidentStatus.DETECTED,
      detectedAt: new Date(),
    });
    const saved = await this.incidentRepo.save(incident);
    this.logger.warn(`Risk incident created: ${saved.id} (${saved.incidentName})`);
    return saved;
  }

  async findAllIncidents(filters?: { status?: string; severity?: string }): Promise<RiskIncident[]> {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.severity) where.severity = filters.severity;
    return this.incidentRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findIncidentById(id: string): Promise<RiskIncident> {
    const incident = await this.incidentRepo.findOne({ where: { id } });
    if (!incident) throw new NotFoundException(`Incident ${id} not found`);
    return incident;
  }

  async investigateIncident(id: string, assignedTo: string): Promise<RiskIncident> {
    const incident = await this.findIncidentById(id);
    incident.status = IncidentStatus.INVESTIGATING;
    incident.assignedTo = assignedTo;
    return this.incidentRepo.save(incident);
  }

  async resolveIncident(id: string, dto: ResolveIncidentDto): Promise<RiskIncident> {
    const incident = await this.findIncidentById(id);
    incident.status = IncidentStatus.RESOLVED;
    incident.rootCause = dto.rootCause;
    incident.resolutionNotes = dto.resolutionNotes;
    incident.resolvedAt = new Date();
    return this.incidentRepo.save(incident);
  }

  // ═══ STATS ═══

  async getStats(): Promise<{
    totalIndicators: number;
    activeIndicators: number;
    criticalIndicators: number;
    acknowledgedIndicators: number;
    resolvedIndicators: number;
    totalCorrelations: number;
    totalIncidents: number;
    openIncidents: number;
    resolvedIncidents: number;
  }> {
    const [
      totalIndicators, activeIndicators, criticalIndicators,
      acknowledgedIndicators, resolvedIndicators,
      totalCorrelations, totalIncidents, openIncidents, resolvedIncidents,
    ] = await Promise.all([
      this.indicatorRepo.count(),
      this.indicatorRepo.count({ where: { status: IndicatorStatus.ACTIVE } }),
      this.indicatorRepo.count({ where: { severity: IndicatorSeverity.CRITICAL } }),
      this.indicatorRepo.count({ where: { status: IndicatorStatus.ACKNOWLEDGED } }),
      this.indicatorRepo.count({ where: { status: IndicatorStatus.RESOLVED } }),
      this.correlationRepo.count(),
      this.incidentRepo.count(),
      this.incidentRepo.count({ where: { status: IncidentStatus.DETECTED } }),
      this.incidentRepo.count({ where: { status: IncidentStatus.RESOLVED } }),
    ]);

    return {
      totalIndicators, activeIndicators, criticalIndicators,
      acknowledgedIndicators, resolvedIndicators,
      totalCorrelations, totalIncidents, openIncidents, resolvedIncidents,
    };
  }
}
