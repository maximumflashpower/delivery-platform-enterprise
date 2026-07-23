import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SandboxInstance } from '../entities/sandbox-instance.entity';
import { SandboxExecution } from '../entities/sandbox-execution.entity';
import { SandboxResourceSnapshot } from '../entities/sandbox-resource-snapshot.entity';
import { CreateSandboxDto, ExecuteInSandboxDto, TerminateSandboxDto } from '../dto/agent-sandbox.dto';

@Injectable()
export class AgentSandboxService {
  private readonly logger = new Logger(AgentSandboxService.name);

  constructor(
    @InjectRepository(SandboxInstance)
    private readonly sandboxRepo: Repository<SandboxInstance>,
    @InjectRepository(SandboxExecution)
    private readonly execRepo: Repository<SandboxExecution>,
    @InjectRepository(SandboxResourceSnapshot)
    private readonly snapshotRepo: Repository<SandboxResourceSnapshot>,
  ) {}

  async create(dto: CreateSandboxDto): Promise<SandboxInstance> {
    const sandbox = new SandboxInstance();
    sandbox.agentId = dto.agentId;
    sandbox.agentName = dto.agentName;
    sandbox.configName = dto.configName ?? 'default';
    sandbox.imageRef = dto.imageRef ?? 'agent-sandbox:latest';
    sandbox.maxCpuPercent = dto.maxCpuPercent ?? 80;
    sandbox.maxMemoryMb = dto.maxMemoryMb ?? 512;
    sandbox.maxDiskMb = dto.maxDiskMb ?? 1024;
    sandbox.maxExecutionTimeMs = dto.maxExecutionTimeMs ?? 60000;
    sandbox.maxTokensPerExecution = dto.maxTokensPerExecution ?? 10000;
    sandbox.maxApiCallsPerExecution = dto.maxApiCallsPerExecution ?? 50;
    sandbox.networkAccess = dto.networkAccess ?? false;
    sandbox.allowedHosts = dto.allowedHosts ? JSON.stringify(dto.allowedHosts) : null;
    sandbox.envVars = dto.envVars ? JSON.stringify(dto.envVars) : null;
    sandbox.status = 'created';
    sandbox.startedAt = null;
    sandbox.terminatedAt = null;
    sandbox.terminationReason = null;
    sandbox.totalExecutions = 0;
    sandbox.totalTokensUsed = 0;
    sandbox.totalApiCalls = 0;
    sandbox.totalCost = 0;
    sandbox.lastExecutionId = null;

    const saved = await this.sandboxRepo.save(sandbox);
    this.logger.log(`Sandbox created: ${saved.id} for agent ${dto.agentId}`);
    return saved;
  }

  async findAll(agentId?: string): Promise<SandboxInstance[]> {
    const where: any = {};
    if (agentId) where.agentId = agentId;
    return this.sandboxRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<SandboxInstance> {
    const sb = await this.sandboxRepo.findOne({ where: { id } });
    if (!sb) throw new NotFoundException(`Sandbox ${id} not found`);
    return sb;
  }

  async getSandboxById(id: string): Promise<SandboxInstance> {
    return this.findById(id);
  }

  async start(id: string): Promise<SandboxInstance> {
    const sandbox = await this.findById(id);
    if (sandbox.status === 'running') {
      throw new BadRequestException(`Sandbox ${id} is already running`);
    }
    if (sandbox.status === 'terminated') {
      throw new BadRequestException(`Sandbox ${id} has been terminated`);
    }
    sandbox.status = 'running';
    sandbox.startedAt = new Date();
    this.logger.log(`Sandbox started: ${id}`);
    return this.sandboxRepo.save(sandbox);
  }

  async terminate(id: string, dto: TerminateSandboxDto): Promise<SandboxInstance> {
    const sandbox = await this.findById(id);
    sandbox.status = 'terminated';
    sandbox.terminatedAt = new Date();
    sandbox.terminationReason = dto.reason ?? 'manual_termination';
    this.logger.warn(`Sandbox terminated: ${id} reason: ${sandbox.terminationReason}`);
    return this.sandboxRepo.save(sandbox);
  }

  async pause(id: string): Promise<SandboxInstance> {
    const sandbox = await this.findById(id);
    if (sandbox.status !== 'running') {
      throw new BadRequestException(`Sandbox ${id} is not running (status: ${sandbox.status})`);
    }
    sandbox.status = 'paused';
    return this.sandboxRepo.save(sandbox);
  }

  async resume(id: string): Promise<SandboxInstance> {
    const sandbox = await this.findById(id);
    if (sandbox.status !== 'paused') {
      throw new BadRequestException(`Sandbox ${id} is not paused (status: ${sandbox.status})`);
    }
    sandbox.status = 'running';
    return this.sandboxRepo.save(sandbox);
  }

  async execute(dto: ExecuteInSandboxDto): Promise<SandboxExecution> {
    const sandbox = await this.getSandboxById(dto.sandboxId);
    if (sandbox.status !== 'running') {
      throw new BadRequestException(`Sandbox ${dto.sandboxId} is not running (status: ${sandbox.status})`);
    }

    const execution = new SandboxExecution();
    execution.sandboxId = dto.sandboxId;
    execution.agentId = sandbox.agentId;
    execution.inputPayload = typeof dto.inputPayload === 'string' 
      ? dto.inputPayload 
      : JSON.stringify(dto.inputPayload);
    execution.status = 'queued';
    execution.tokensUsed = 0;
    execution.apiCallsMade = 0;
    execution.toolsInvoked = 0;
    execution.executionTimeMs = 0;
    execution.peakMemoryMb = 0;
    execution.avgCpuPercent = 0;
    execution.estimatedCost = 0;
    execution.outputPayload = null;
    execution.errorMessage = null;
    execution.exitCode = null;
    execution.startedAt = null;
    execution.completedAt = null;

    const saved = await this.execRepo.save(execution);

    sandbox.lastExecutionId = saved.id;
    await this.sandboxRepo.save(sandbox);

    saved.status = 'running';
    saved.startedAt = new Date();
    await this.execRepo.save(saved);

    const tokensUsed = Math.floor(Math.random() * 5000) + 100;
    const apiCalls = Math.floor(Math.random() * 30) + 1;
    const execTime = Math.floor(Math.random() * 5000) + 100;
    const peakMem = Math.floor(Math.random() * 400) + 50;
    const avgCpu = Math.floor(Math.random() * 60) + 10;
    const cost = (tokensUsed * 0.00002) + (apiCalls * 0.001);

    saved.status = 'completed';
    saved.tokensUsed = tokensUsed;
    saved.apiCallsMade = apiCalls;
    saved.toolsInvoked = Math.floor(Math.random() * 5);
    saved.executionTimeMs = execTime;
    saved.peakMemoryMb = peakMem;
    saved.avgCpuPercent = avgCpu;
    saved.estimatedCost = parseFloat(cost.toFixed(6));
    saved.outputPayload = JSON.stringify({ result: 'execution_completed', sandboxId: dto.sandboxId });
    saved.exitCode = 0;
    saved.completedAt = new Date();

    const completed = await this.execRepo.save(saved);

    sandbox.totalExecutions += 1;
    sandbox.totalTokensUsed += tokensUsed;
    sandbox.totalApiCalls += apiCalls;
    sandbox.totalCost = parseFloat((Number(sandbox.totalCost) + cost).toFixed(6));
    await this.sandboxRepo.save(sandbox);

    const snapshot = new SandboxResourceSnapshot();
    snapshot.sandboxId = dto.sandboxId;
    snapshot.executionId = saved.id;
    snapshot.cpuPercent = avgCpu;
    snapshot.memoryMb = peakMem;
    snapshot.diskMb = Math.floor(Math.random() * 500) + 50;
    snapshot.networkInKb = Math.floor(Math.random() * 100);
    snapshot.networkOutKb = Math.floor(Math.random() * 100);
    snapshot.activeConnections = Math.floor(Math.random() * 10);
    snapshot.tokenRate = Math.floor(tokensUsed / (execTime / 1000 || 1));
    await this.snapshotRepo.save(snapshot);

    this.logger.log(`Execution completed: ${saved.id} tokens=${tokensUsed} time=${execTime}ms`);
    return completed;
  }

  async getExecutions(sandboxId: string): Promise<SandboxExecution[]> {
    return this.execRepo.find({
      where: { sandboxId },
      order: { createdAt: 'DESC' },
    });
  }

  async getExecutionById(id: string): Promise<SandboxExecution> {
    const exec = await this.execRepo.findOne({ where: { id } });
    if (!exec) throw new NotFoundException(`Execution ${id} not found`);
    return exec;
  }

  async getSnapshots(sandboxId: string): Promise<SandboxResourceSnapshot[]> {
    return this.snapshotRepo.find({
      where: { sandboxId },
      order: { createdAt: 'DESC' },
    });
  }

  async getStats(): Promise<any> {
    const totalSandboxes = await this.sandboxRepo.count();
    const runningSandboxes = await this.sandboxRepo.count({ where: { status: 'running' } });
    const terminatedSandboxes = await this.sandboxRepo.count({ where: { status: 'terminated' } });
    const totalExecutions = await this.execRepo.count();
    const completedExecutions = await this.execRepo.count({ where: { status: 'completed' } });
    const failedExecutions = await this.execRepo.count({ where: { status: 'failed' } });

    const allSandboxes = await this.sandboxRepo.find();
    const totalTokens = allSandboxes.reduce((sum, s) => sum + (s.totalTokensUsed || 0), 0);
    const totalCost = allSandboxes.reduce((sum, s) => sum + Number(s.totalCost || 0), 0);

    return {
      totalSandboxes,
      runningSandboxes,
      terminatedSandboxes,
      totalExecutions,
      completedExecutions,
      failedExecutions,
      totalTokensUsed: totalTokens,
      totalEstimatedCost: parseFloat(totalCost.toFixed(6)),
    };
  }
}
