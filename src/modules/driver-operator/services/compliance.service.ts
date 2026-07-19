import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Compliance } from '../entities/compliance.entity';
import { ComplianceStatus } from '../enums/compliance-status.enum';

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  constructor(
    @InjectRepository(Compliance)
    private readonly complianceRepo: Repository<Compliance>,
  ) {}

  async findAll(): Promise<Compliance[]> {
    return this.complianceRepo.find({ where: { deletedAt: IsNull() }, relations: {'driver'} });
  }

  async findByDriverId(driverId: string): Promise<Compliance[]> {
    return this.complianceRepo.find({ 
      where: { driverId, deletedAt: IsNull() }, 
      relations: {'driver'},
      order: { verifiedAt: 'DESC' } 
    });
  }

  async findById(id: string): Promise<Compliance> {
    const compliance = await this.complianceRepo.findOne({ 
      where: { id, deletedAt: IsNull() }, 
      relations: {'driver'} 
    });
    if (!compliance) throw new NotFoundException(`Compliance record with ID ${id} not found`);
    return compliance;
  }

  async create(data: Partial<Compliance>): Promise<Compliance> {
    const compliance = this.complianceRepo.create(data);
    return this.complianceRepo.save(compliance);
  }

  async verify(id: string): Promise<Compliance> {
    const compliance = await this.findById(id);
    compliance.status = ComplianceStatus.VERIFIED;
    compliance.verifiedAt = new Date();
    return this.complianceRepo.save(compliance);
  }

  async reject(id: string, reason?: string): Promise<Compliance> {
    const compliance = await this.findById(id);
    compliance.status = ComplianceStatus.REJECTED;
    compliance.notes = reason || compliance.notes;
    return this.complianceRepo.save(compliance);
  }

  async requestReview(id: string): Promise<Compliance> {
    const compliance = await this.findById(id);
    compliance.status = ComplianceStatus.PENDING_REVIEW;
    return this.complianceRepo.save(compliance);
  }
}
