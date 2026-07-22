import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdControlSetting } from '../entities/ad-control-setting.entity';
import { CreateAdControlSettingDto } from '../dto/create-ad-control-setting.dto';
import { UpdateAdControlSettingDto } from '../dto/update-ad-control-setting.dto';

@Injectable()
export class AdControlSettingService {
  constructor(
    @InjectRepository(AdControlSetting)
    private readonly repo: Repository<AdControlSetting>,
  ) {}

  findAll(category?: string): Promise<AdControlSetting[]> {
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findByKey(key: string): Promise<AdControlSetting> {
    const entity = await this.repo.findOne({ where: { settingKey: key } });
    if (!entity) throw new NotFoundException(`AdControlSetting with key "${key}" not found`);
    return entity;
  }

  async findOne(id: string): Promise<AdControlSetting> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`AdControlSetting with id "${id}" not found`);
    return entity;
  }

  async create(dto: CreateAdControlSettingDto): Promise<AdControlSetting> {
    const existing = await this.repo.findOne({ where: { settingKey: dto.settingKey } });
    if (existing) {
      throw new BadRequestException(`Setting with key "${dto.settingKey}" already exists`);
    }
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateAdControlSettingDto): Promise<AdControlSetting> {
    const entity = await this.findOne(id);
    if (!entity.isEditable && dto.settingValue !== undefined) {
      throw new BadRequestException(`Setting "${entity.settingKey}" is not editable`);
    }
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async updateByKey(key: string, value: string): Promise<AdControlSetting> {
    const entity = await this.findByKey(key);
    if (!entity.isEditable) {
      throw new BadRequestException(`Setting "${key}" is not editable`);
    }
    entity.settingValue = value;
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softDelete(entity.id);
  }
}
