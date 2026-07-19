import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationBadge } from '../entities/verification-badge.entity';
import { TrustScore } from '../entities/trust-score.entity';
import { Incident } from '../entities/incident.entity';
import { VerificationLevel } from '../enums/verification-level.enum';
import { TrustScoreTrend } from '../enums/trust-score-trend.enum';
import { IncidentSeverity } from '../enums/incident-severity.enum';

@Injectable()
export class TrustSafetyService {
  private readonly logger = new Logger(TrustSafetyService.name);

  constructor(
    @InjectRepository(VerificationBadge)
    private readonly badgeRepo: Repository<VerificationBadge>,
    @InjectRepository(TrustScore)
    private readonly scoreRepo: Repository<TrustScore>,
    @InjectRepository(Incident)
    private readonly incidentRepo: Repository<Incident>,
  ) {}

  // Badges
  async awardBadge(userId: string, data: { badgeType: string; level: VerificationLevel; awardedReason?: string; expiresAt?: Date }): Promise<VerificationBadge> {
    const badge = this.badgeRepo.create({
      userId,
      ...data,
      awardedAt: new Date(),
    });
    return this.badgeRepo.save(badge);
  }

  async getUserBadges(userId: string): Promise<VerificationBadge[]> {
    return this.badgeRepo.find({ where: { userId }, order: { awardedAt: 'DESC' } });
  }

  async revokeBadge(badgeId: string): Promise<void> {
    const badge = await this.badgeRepo.findOne({ where: { id: badgeId } });
    if (!badge) throw new NotFoundException('Badge not found');
    await this.badgeRepo.remove(badge);
  }

  // Trust Scores
  async getOrCreateScore(userId: string): Promise<TrustScore> {
    let score = await this.scoreRepo.findOne({ where: { userId }, order: { calculatedAt: 'DESC' } });
    if (!score) {
      const created = this.scoreRepo.create({
        userId,
        score: 50,
        trend: TrustScoreTrend.STABLE,
        calculatedAt: new Date(),
      });
      score = await this.scoreRepo.save(created);
    }
    return score;
  }

  async updateScore(userId: string, newScore: number, factors?: Record<string, number>): Promise<TrustScore> {
    const current = await this.getOrCreateScore(userId);
    const trend = newScore > current.score ? TrustScoreTrend.RISING : newScore < current.score ? TrustScoreTrend.FALLING : TrustScoreTrend.STABLE;
    const created = this.scoreRepo.create({
      userId,
      score: Math.max(0, Math.min(100, newScore)),
      trend,
      calculatedAt: new Date(),
      factors,
    });
    return this.scoreRepo.save(created);
  }

  async getUserScoreHistory(userId: string, limit = 10): Promise<TrustScore[]> {
    return this.scoreRepo.find({
      where: { userId },
      order: { calculatedAt: 'DESC' },
      take: limit,
    });
  }

  // Incidents
  async createIncident(data: { reportedUserId?: string; reporterId?: string; category: string; severity: IncidentSeverity; description: string }): Promise<Incident> {
    const incident = this.incidentRepo.create({
      ...data,
      status: 'open',
    });
    return this.incidentRepo.save(incident);
  }

  async findIncidentById(id: string): Promise<Incident> {
    const incident = await this.incidentRepo.findOne({ where: { id } });
    if (!incident) throw new NotFoundException('Incident not found');
    return incident;
  }

  async findByUser(userId: string): Promise<Incident[]> {
    return this.incidentRepo.find({
      where: [{ reportedUserId: userId }, { reporterId: userId }],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllIncidents(status?: string): Promise<Incident[]> {
    const where = status ? { status } : {};
    return this.incidentRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async resolveIncident(id: string, resolutionNotes: string): Promise<Incident> {
    const incident = await this.findIncidentById(id);
    incident.status = 'resolved';
    incident.resolvedAt = new Date();
    incident.resolutionNotes = resolutionNotes;
    return this.incidentRepo.save(incident);
  }

  async escalateIncident(id: string, newSeverity: IncidentSeverity): Promise<Incident> {
    const incident = await this.findIncidentById(id);
    incident.severity = newSeverity;
    return this.incidentRepo.save(incident);
  }
}
