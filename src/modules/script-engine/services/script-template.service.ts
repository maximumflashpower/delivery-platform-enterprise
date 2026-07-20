import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { ScriptTemplate } from '../entities/script-template.entity';
import { CreateScriptTemplateDto } from '../dto/create-script-template.dto';

@Injectable()
export class ScriptTemplateService {
  constructor(
    @InjectRepository(ScriptTemplate)
    private readonly templateRepo: Repository<ScriptTemplate>,
  ) {}

  async create(dto: CreateScriptTemplateDto): Promise<ScriptTemplate> {
    const template = this.templateRepo.create(dto);
    template.runCount = 0;
    return this.templateRepo.save(template);
  }

  async findAll(scriptId?: string): Promise<ScriptTemplate[]> {
    const query = this.templateRepo.createQueryBuilder('template');

    if (scriptId) {
      query.where('template.scriptId = :scriptId', { scriptId });
    }

    query.orderBy('template.createdAt', 'DESC');
    return query.getMany();
  }

  async findById(id: string): Promise<ScriptTemplate> {
    const template = await this.templateRepo.findOne({ where: { id } });
    if (!template) throw new NotFoundException(`Template ${id} not found`);
    return template;
  }

  async update(id: string, partial: Partial<ScriptTemplate>): Promise<ScriptTemplate> {
    const template = await this.findById(id);
    Object.assign(template, partial);
    return this.templateRepo.save(template);
  }

  async remove(id: string): Promise<void> {
    const template = await this.findById(id);
    await this.templateRepo.remove(template);
  }

  async activate(id: string): Promise<ScriptTemplate> {
    const template = await this.findById(id);
    template.isActive = true;
    return this.templateRepo.save(template);
  }

  async deactivate(id: string): Promise<ScriptTemplate> {
    const template = await this.findById(id);
    template.isActive = false;
    return this.templateRepo.save(template);
  }

  async incrementRunCount(id: string): Promise<void> {
    await this.templateRepo.increment({ id }, 'runCount', 1);
    await this.templateRepo.update(id, { lastRunAt: new Date() });
  }

  async getScheduledTemplates(): Promise<ScriptTemplate[]> {
    const now = new Date();
    return this.templateRepo.find({
      where: [
        { isActive: true, scheduledStart: LessThan(now) },
        { isActive: true, scheduledEnd: MoreThan(now) },
      ] as any,
    });
  }
}
