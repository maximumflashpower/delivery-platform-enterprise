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
    let script: Script;

    if (dto.scriptId) {
      script = await this.scriptRepo.findOne({
        where: { id: dto.scriptId, deletedAt: null },
      });
      if (!script) throw new NotFoundException(`Script ${dto.scriptId} not found`);

      if (!script.isEnabled) {
        throw new BadRequestException('Script is disabled');
      }

      if (script.status !== 'active') {
        throw new BadRequestException(`Script is ${script.status}, cannot execute`);
      }
    } else if (dto.sourceCode) {
      // Inline execution (sandboxed)
      script = null;
    } else {
      throw new BadRequestException('Either scriptId or sourceCode required');
    }

    const execution = this.executionRepo.create({
      scriptId: script?.id,
      triggeredByUserId: dto.userId,
      triggerType: dto.triggerType || 'manual',
      inputParameters: dto.inputParameters ? JSON.stringify(dto.inputParameters) : null,
      status: 'running',
      startedAt: new Date(),
    });

    // Save initially (running state)
    await this.executionRepo.save(execution);

    // Simulate execution (in production, use VM2/sandbox)
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
    script: Script,
    dto: ExecuteScriptDto,
  ): Promise<void> {
    // Placeholder for actual execution engine
    // Would use vm2, isol-vm, or WASM sandbox
    const result = {
      success: true,
      message: 'Execution simulated',
      data: dto.inputParameters,
    };

    execution.status = 'completed';
    execution.outputResult = JSON.stringify(result);
    execution.completedAt = new Date();
    execution.executionTimeMs = Math.floor(Math.random() * 1000) + 100; // Simulated timing
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
      relations: ['script', 'triggeredByUser'],
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
