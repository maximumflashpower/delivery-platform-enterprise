import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppealEvidence } from '../entities/appeal-evidence.entity';
import { CreateAppealEvidenceDto } from '../dto/create-appeal-evidence.dto';

@Injectable()
export class AppealEvidenceService {
  constructor(
    @InjectRepository(AppealEvidence)
    private readonly repo: Repository<AppealEvidence>,
  ) {}

  async create(dto: CreateAppealEvidenceDto): Promise<AppealEvidence> {
    const ev = new AppealEvidence();
    ev.appealId = dto.appealId;
    ev.uploadedByUserId = dto.uploadedByUserId;
    ev.fileId = dto.fileId || null;
    ev.evidenceType = dto.evidenceType as any;
    ev.description = dto.description || '';
    ev.isVerified = dto.isVerified ?? true;
    return this.repo.save(ev);
  }

  async findByAppeal(appealId: string): Promise<AppealEvidence[]> {
    return this.repo.find({
      where: { appealId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<AppealEvidence> {
    const ev = await this.repo.findOne({ where: { id } });
    if (!ev) throw new NotFoundException(`Evidence ${id} not found`);
    return ev;
  }

  async markVerified(id: string, verifiedBy: string): Promise<AppealEvidence> {
    const ev = await this.findById(id);
    ev.isVerified = true;
    ev.verifiedAt = new Date();
    ev.verifiedBy = verifiedBy;
    return this.repo.save(ev);
  }

  async markUnverified(id: string, reason?: string): Promise<AppealEvidence> {
    const ev = await this.findById(id);
    ev.isVerified = false;
    if (reason) ev.description = `${ev.description}\nUnverified: ${reason}`;
    return this.repo.save(ev);
  }
}
