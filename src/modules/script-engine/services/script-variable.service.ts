import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScriptVariable } from '../entities/script-variable.entity';
import { CreateScriptVariableDto } from '../dto/create-script-variable.dto';

@Injectable()
export class ScriptVariableService {
  constructor(
    @InjectRepository(ScriptVariable)
    private readonly varRepo: Repository<ScriptVariable>,
  ) {}

  async create(dto: CreateScriptVariableDto): Promise<ScriptVariable> {
    const variable = this.varRepo.create(dto);
    return this.varRepo.save(variable);
  }

  async findByScript(scriptId: string, includeSecrets?: boolean): Promise<ScriptVariable[]> {
    const query = this.varRepo.createQueryBuilder('variable')
      .where('variable.scriptId = :scriptId', { scriptId });

    if (!includeSecrets) {
      query.andWhere('variable.isSecret = :includeSecrets', { includeSecrets: false });
    }

    query.orderBy('variable.variableName', 'ASC');
    return query.getMany();
  }

  async findById(id: string): Promise<ScriptVariable> {
    const variable = await this.varRepo.findOne({ where: { id } });
    if (!variable) throw new NotFoundException(`Variable ${id} not found`);
    return variable;
  }

  async update(id: string, partial: Partial<ScriptVariable>): Promise<ScriptVariable> {
    const variable = await this.findById(id);

    if (variable.expiresAt && variable.expiresAt < new Date()) {
      throw new BadRequestException('Variable has expired');
    }

    Object.assign(variable, partial);
    variable.lastModifiedAt = new Date();
    return this.varRepo.save(variable);
  }

  async remove(id: string): Promise<void> {
    const variable = await this.findById(id);
    await this.varRepo.remove(variable);
  }

  async validate(variable: ScriptVariable, inputValue: string): Promise<{ valid: boolean; error?: string }> {
    if (variable.isRequired && !inputValue) {
      return { valid: false, error: 'Required variable not provided' };
    }

    if (variable.validationRule) {
      try {
        const regex = new RegExp(variable.validationRule);
        if (!regex.test(inputValue)) {
          return { valid: false, error: 'Validation rule mismatch' };
        }
      } catch {
        return { valid: true };
      }
    }

    return { valid: true };
  }
}
