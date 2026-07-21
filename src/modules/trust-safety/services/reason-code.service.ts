import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReasonCode } from '../entities/reason-code.entity';
import { CreateReasonCodeDto } from '../dto/create-reason-code.dto';

@Injectable()
export class ReasonCodeService {
  constructor(
    @InjectRepository(ReasonCode)
    private readonly repo: Repository<ReasonCode>,
  ) {}

  async create(dto: CreateReasonCodeDto): Promise<ReasonCode> {
    const existing = await this.repo.findOne({ where: { code: dto.code } });
    if (existing) throw new BadRequestException(`Reason code ${dto.code} already exists`);
    
    const rc = new ReasonCode();
    rc.code = dto.code;
    rc.title = dto.title;
    rc.description = dto.description;
    rc.severity = (dto.severity as any) || 'low';
    rc.autoAction = (dto.autoAction as any) || 'auto';
    rc.guidelines = dto.guidelines || '';
    rc.escalationPath = dto.escalationPath || '';
    rc.priorityWeight = dto.priorityWeight || 10;
    rc.isActive = dto.isActive ?? true;
    rc.usageCount = 0;
    return this.repo.save(rc);
  }

  async findAll(activeOnly: boolean = false): Promise<ReasonCode[]> {
    const query = this.repo.createQueryBuilder('rc');
    if (activeOnly) query.where('rc.isActive = :isActive', { isActive: true });
    return query.orderBy('rc.severity', 'DESC').orderBy('rc.priorityWeight', 'DESC').getMany();
  }

  async findById(id: string): Promise<ReasonCode> {
    const rc = await this.repo.findOne({ where: { id } });
    if (!rc) throw new NotFoundException(`Reason code ${id} not found`);
    return rc;
  }

  async findByCode(code: string): Promise<ReasonCode> {
    const rc = await this.repo.findOne({ where: { code } });
    if (!rc) throw new NotFoundException(`Reason code ${code} not found`);
    return rc;
  }

  async incrementUsage(code: string): Promise<void> {
    const rc = await this.findByCode(code);
    rc.usageCount += 1;
    await this.repo.save(rc);
  }

  async update(id: string, dto: Partial<CreateReasonCodeDto>): Promise<ReasonCode> {
    const rc = await this.findById(id);
    Object.assign(rc, dto);
    if (dto.code) rc.code = dto.code;
    if (dto.severity) rc.severity = dto.severity as any;
    if (dto.autoAction) rc.autoAction = dto.autoAction as any;
    if (dto.priorityWeight) rc.priorityWeight = dto.priorityWeight;
    return this.repo.save(rc);
  }

  async deactivate(id: string): Promise<ReasonCode> {
    const rc = await this.findById(id);
    rc.isActive = false;
    return this.repo.save(rc);
  }
}
