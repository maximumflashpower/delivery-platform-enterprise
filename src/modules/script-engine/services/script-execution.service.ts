import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScriptExecution } from '../entities/script-execution.entity';
import { Script } from '../entities/script.entity';
import { ExecuteScriptDto } from '../dto/execute-script.dto';

@Injectable()
export class ScriptExecutionService {
  constructor(
    @InjectRepository(ScriptExecution)
    private readonly executionRepo: Repository<ScriptExecution>,
    @InjectRepository(Script)
    private readonly scriptRepo: Repository<Script>,
  ) {}

  async execute(dto: ExecuteScriptDto): Promise<ScriptExecution> {
    let script: Script | null = null;

    if (dto.scriptId) {
      script = await this.scriptRepo.findOne({
        where: { id: dto.scriptId, deletedAt: null } as any,
      });
      if (!script) throw new NotFoundException(`Script ${dto.scriptId} not found`);

      if (!script.isEnabled) {
        throw new BadRequestException('Script is disabled');
      }

      if (script.status !== 'active') {
        throw new BadRequestException(`Script is ${script.status}, cannot execute`);
      }
    }

    const execution = new ScriptExecution();
    execution.scriptId = script?.id || '';  // Empty string, not null
    execution.triggeredByUserId = dto.userId || '';
    execution.triggerType = dto.triggerType || 'manual';
    execution.inputParameters = dto.inputParameters ? JSON.stringify(dto.inputParameters) : '';
    execution.status = 'running';
    execution.startedAt = new Date();
    execution.executionTimeMs = 0;
    execution.retryAttempt = 1;

    await this.executionRepo.save(execution);

    try {
      await this.simulateExecution(execution, script, dto);
    } catch (err) {
      execution.status = 'failed';
      execution.errorMessage = err.message;
      execution.completedAt = new Date();
      execution.executionTimeMs = Date.now() - execution.startedAt.getTime();
      await this.executionRepo.save(execution);
      throw err;
    }

    return execution;
  }

  private async simulateExecution(
    execution: ScriptExecution,
    script: Script | null,
    dto: ExecuteScriptDto,
  ): Promise<void> {
    const result = {
      success: true,
      message: 'Execution simulated',
      data: dto.inputParameters,
    };

    execution.status = 'completed';
    execution.outputResult = JSON.stringify(result);
    execution.completedAt = new Date();
    execution.executionTimeMs = Math.floor(Math.random() * 1000) + 100;
    execution.logs = JSON.stringify([{ timestamp: new Date().toISOString(), level: 'info', message: 'Execution completed' }]);

    await this.executionRepo.save(execution);

    if (script) {
      await this.scriptRepo.increment({ id: script.id }, 'executionCount', 1);
      await this.scriptRepo.update(script.id, { lastExecutedAt: new Date() });
    }
  }

  async getById(id: string): Promise<ScriptExecution> {
    const execution = await this.executionRepo.findOne({
      where: { id },
      relations: ['script'],
    });

    if (!execution) throw new NotFoundException(`Execution ${id} not found`);
    return execution;
  }

  async findByScript(scriptId: string, limit?: number): Promise<ScriptExecution[]> {
    const query = this.executionRepo.createQueryBuilder('execution')
      .where('execution.scriptId = :scriptId', { scriptId })
      .orderBy('execution.createdAt', 'DESC');

    if (limit) {
      query.take(limit);
    }

    return query.getMany();
  }

  async cancel(id: string): Promise<ScriptExecution> {
    const execution = await this.getById(id);

    if (['completed', 'failed', 'timeout', 'cancelled'].includes(execution.status)) {
      throw new BadRequestException(`Cannot cancel execution with status: ${execution.status}`);
    }

    execution.status = 'cancelled';
    execution.completedAt = new Date();
    return this.executionRepo.save(execution);
  }

  async getStats(scriptId: string, days?: number): Promise<{
    total: number;
    completed: number;
    failed: number;
    avgExecutionTimeMs: number;
  }> {
    const query = this.executionRepo.createQueryBuilder('execution')
      .where('execution.scriptId = :scriptId', { scriptId });

    if (days) {
      const date = new Date();
      date.setDate(date.getDate() - days);
      query.andWhere('execution.startedAt >= :since', { since: date });
    }

    const executions = await query.getMany();

    const stats = executions.reduce(
      (acc, ex) => ({
        total: acc.total + 1,
        completed: acc.completed + (ex.status === 'completed' ? 1 : 0),
        failed: acc.failed + (ex.status === 'failed' || ex.status === 'timeout' ? 1 : 0),
        avgExecutionTimeMs: acc.avgExecutionTimeMs + ex.executionTimeMs,
      }),
      { total: 0, completed: 0, failed: 0, avgExecutionTimeMs: 0 },
    );

    stats.avgExecutionTimeMs = stats.total > 0 ? Math.round(stats.avgExecutionTimeMs / stats.total) : 0;

    return stats;
  }
}
