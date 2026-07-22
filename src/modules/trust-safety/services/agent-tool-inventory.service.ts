import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentToolInventory } from '../entities/agent-tool-inventory.entity';
import { CreateToolInventoryDto } from '../dto/agent-security-test.dto';

@Injectable()
export class AgentToolInventoryService {
  private readonly logger = new Logger(AgentToolInventoryService.name);

  constructor(
    @InjectRepository(AgentToolInventory)
    private readonly repo: Repository<AgentToolInventory>,
  ) {}

  async registerTool(dto: CreateToolInventoryDto): Promise<AgentToolInventory> {
    const tool = new AgentToolInventory();
    Object.assign(tool, dto);
    tool.status = dto.status || 'enabled';
    tool.riskRating = dto.riskRating || 'medium';
    tool.requiresApproval = dto.toolType === 'code_execution' || dto.toolType === 'data_write' || dto.toolType === 'external_api';
    tool.auditEnabled = true;
    return this.repo.save(tool);
  }

  async findByAgent(agentId: string): Promise<AgentToolInventory[]> {
    return this.repo.find({ where: { agentId }, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<AgentToolInventory> {
    const tool = await this.repo.findOne({ where: { id } });
    if (!tool) throw new NotFoundException(`Tool inventory entry ${id} not found`);
    return tool;
  }

  async quarantine(toolId: string, reason?: string): Promise<AgentToolInventory> {
    const tool = await this.findById(toolId);
    tool.status = 'quarantined';
    if (reason) tool.permissionsScope = `QUARANTINED: ${reason}`;
    this.logger.warn(`Tool ${toolId} quarantined: ${reason || 'no reason provided'}`);
    return this.repo.save(tool);
  }

  async enable(toolId: string): Promise<AgentToolInventory> {
    const tool = await this.findById(toolId);
    tool.status = 'enabled';
    return this.repo.save(tool);
  }

  async restrict(toolId: string): Promise<AgentToolInventory> {
    const tool = await this.findById(toolId);
    tool.status = 'restricted';
    return this.repo.save(tool);
  }

  async getStats(): Promise<{
    totalTools: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    criticalTools: number;
    quarantinedTools: number;
  }> {
    const totalTools = await this.repo.count();
    const all = await this.repo.find();
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    let criticalTools = 0;
    let quarantinedTools = 0;

    all.forEach(t => {
      byType[t.toolType] = (byType[t.toolType] || 0) + 1;
      byStatus[t.status] = (byStatus[t.status] || 0) + 1;
      if (t.riskRating === 'critical') criticalTools++;
      if (t.status === 'quarantined') quarantinedTools++;
    });

    return { totalTools, byType, byStatus, criticalTools, quarantinedTools };
  }
}
