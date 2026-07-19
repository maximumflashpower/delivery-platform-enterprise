import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { SlaConfig } from '../entities/sla-config.entity';

@Injectable()
export class SlaConfigService {
  private readonly logger = new Logger(SlaConfigService.name);

  constructor(
    @InjectRepository(SlaConfig)
    private readonly slaRepo: Repository<SlaConfig>,
  ) {}

  async findAll(): Promise<SlaConfig[]> {
    return this.slaRepo.find({ where: { deletedAt: IsNull() }, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<SlaConfig> {
    const s = await this.slaRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!s) throw new NotFoundException(`SLA config with ID ${id} not found`);
    return s;
  }

  async create(data: Partial<SlaConfig>): Promise<SlaConfig> {
    if (!data.category || !data.priority) {
      throw new BadRequestException('category and priority are required');
    }
    return this.slaRepo.save(this.slaRepo.create(data));
  }

  async update(id: string, data: Partial<SlaConfig>): Promise<SlaConfig> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.slaRepo.update(id, data);
    return this.findById(id);
  }

  async activate(id: string): Promise<SlaConfig> {
    const s = await this.findById(id);
    s.isActive = true;
    return this.slaRepo.save(s);
  }

  async deactivate(id: string): Promise<SlaConfig> {
    const s = await this.findById(id);
    s.isActive = false;
    return this.slaRepo.save(s);
  }
}
