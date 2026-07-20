import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Script } from '../entities/script.entity';
import { CreateScriptDto, UpdateScriptDto } from '../dto/create-script.dto';

@Injectable()
export class ScriptService {
  constructor(
    @InjectRepository(Script)
    private readonly scriptRepo: Repository<Script>,
  ) {}

  async create(dto: CreateScriptDto): Promise<Script> {
    if (dto.sourceCode.length > 50000) {
      throw new BadRequestException('Source code exceeds maximum size (50KB)');
    }

    const script = this.scriptRepo.create(dto);
    script.executionCount = 0;
    script.version = 1;
    return this.scriptRepo.save(script);
  }

  async findAll(options?: { status?: string; language?: string }): Promise<Script[]> {
    const query = this.scriptRepo.createQueryBuilder('script')
      .where('script.deletedAt IS NULL');

    if (options?.status) {
      query.andWhere('script.status = :status', { status: options.status });
    }

    if (options?.language) {
      query.andWhere('script.language = :language', { language: options.language });
    }

    query.orderBy('script.createdAt', 'DESC');
    return query.getMany();
  }

  async findById(id: string): Promise<Script> {
    const script = await this.scriptRepo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['executions', 'templates'],
    });

    if (!script) throw new NotFoundException(`Script ${id} not found`);
    return script;
  }

  async update(id: string, dto: UpdateScriptDto): Promise<Script> {
    const script = await this.findById(id);

    if (script.status === 'locked') {
      throw new ForbiddenException('Locked scripts cannot be modified');
    }

    // Increment version if source code changed
    if (dto.sourceCode && dto.sourceCode !== script.sourceCode) {
      script.version += 1;
    }

    Object.assign(script, dto);
    return this.scriptRepo.save(script);
  }

  async remove(id: string): Promise<void> {
    const script = await this.findById(id);
    script.deletedAt = new Date();
    await this.scriptRepo.save(script);
  }

  async publish(id: string): Promise<Script> {
    const script = await this.findById(id);

    if (script.status !== 'draft') {
      throw new BadRequestException('Only draft scripts can be published');
    }

    script.status = 'active';
    script.publishedAt = new Date();
    return this.scriptRepo.save(script);
  }

  async deactivate(id: string): Promise<Script> {
    const script = await this.findById(id);
    script.status = 'inactive';
    return this.scriptRepo.save(script);
  }

  async incrementExecutionCount(id: string): Promise<void> {
    await this.scriptRepo.increment({ id }, 'executionCount', 1);
    await this.scriptRepo.update(id, { lastExecutedAt: new Date() });
  }

  async validateSyntax(sourceCode: string, language: string): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!sourceCode || sourceCode.trim().length === 0) {
      errors.push('Empty source code');
    }

    if (['javascript', 'typescript'].includes(language)) {
      const openBraces = (sourceCode.match(/\{/g) || []).length;
      const closeBraces = (sourceCode.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        errors.push('Unbalanced braces');
      }
    }

    return { valid: errors.length === 0, errors };
  }
}
