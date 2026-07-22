import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContextFirewallRule } from '../entities/context-firewall-rule.entity';
import { ContextFilterLog } from '../entities/context-filter-log.entity';
import { AgentContextProfile } from '../entities/agent-context-profile.entity';
import { CreateFirewallRuleDto, CreateContextProfileDto, FilterContextDto } from '../dto/context-firewall.dto';

@Injectable()
export class ContextFirewallService {
  private readonly logger = new Logger(ContextFirewallService.name);

  constructor(
    @InjectRepository(ContextFirewallRule)
    private readonly ruleRepo: Repository<ContextFirewallRule>,
    @InjectRepository(ContextFilterLog)
    private readonly logRepo: Repository<ContextFilterLog>,
    @InjectRepository(AgentContextProfile)
    private readonly profileRepo: Repository<AgentContextProfile>,
  ) {}

  // ─── RULE MANAGEMENT ───

  async createRule(dto: CreateFirewallRuleDto): Promise<ContextFirewallRule> {
    const rule = new ContextFirewallRule();
    Object.assign(rule, dto);
    rule.status = dto.status || 'active';
    rule.action = dto.action || 'block';
    rule.ruleType = dto.ruleType || 'keyword';
    rule.appliesTo = dto.appliesTo || 'all';
    rule.priority = dto.priority || 100;
    rule.caseSensitive = dto.caseSensitive ?? true;
    return this.ruleRepo.save(rule);
  }

  async findRulesByAgent(agentId: string, activeOnly = false): Promise<ContextFirewallRule[]> {
    if (activeOnly) {
      return this.ruleRepo.find({ where: { agentId, status: 'active' }, order: { priority: 'ASC' } });
    }
    return this.ruleRepo.find({ where: { agentId }, order: { priority: 'ASC' } });
  }

  async findRuleById(id: string): Promise<ContextFirewallRule> {
    const rule = await this.ruleRepo.findOne({ where: { id } });
    if (!rule) throw new NotFoundException(`Firewall rule ${id} not found`);
    return rule;
  }

  async deleteRule(id: string): Promise<void> {
    const rule = await this.findRuleById(id);
    rule.status = 'archived';
    await this.ruleRepo.save(rule);
  }

  // ─── PROFILE MANAGEMENT ───

  async createProfile(dto: CreateContextProfileDto): Promise<AgentContextProfile> {
    const existing = await this.profileRepo.findOne({ where: { agentId: dto.agentId, status: 'active' } });
    if (existing) {
      throw new BadRequestException(`Active profile already exists for agent ${dto.agentId}`);
    }
    const profile = new AgentContextProfile();
    Object.assign(profile, dto);
    profile.status = 'active';
    profile.clearanceLevel = dto.clearanceLevel || 'standard';
    profile.piiFiltering = dto.piiFiltering ?? true;
    profile.credentialFiltering = dto.credentialFiltering ?? true;
    profile.systemPromptProtection = dto.systemPromptProtection ?? false;
    profile.maxContextLength = dto.maxContextLength || 50000;
    profile.maxRequestsPerMinute = dto.maxRequestsPerMinute || 5;
    profile.auditLogging = dto.auditLogging ?? true;
    return this.profileRepo.save(profile);
  }

  async findProfileByAgent(agentId: string): Promise<AgentContextProfile> {
    const profile = await this.profileRepo.findOne({ where: { agentId, status: 'active' } });
    if (!profile) throw new NotFoundException(`No active context profile for agent ${agentId}`);
    return profile;
  }

  async findProfileById(id: string): Promise<AgentContextProfile> {
    const profile = await this.profileRepo.findOne({ where: { id } });
    if (!profile) throw new NotFoundException(`Profile ${id} not found`);
    return profile;
  }

  // ─── CONTEXT FILTERING (CORE) ───

  async filterContext(dto: FilterContextDto): Promise<{
    filterResult: string;
    filteredContext: string;
    rulesTriggered: number;
    triggeredRuleIds: string[];
    blockedReason: string | null;
    originalLength: number;
    filteredLength: number;
    logId: string;
  }> {
    const startTime = Date.now();
    const profile = await this.findProfileByAgent(dto.agentId);
    const rules = await this.findRulesByAgent(dto.agentId, true);

    let filteredContext = dto.context;
    const triggeredRuleIds: string[] = [];
    let blocked = false;
    let blockedReason: string | null = null;

    // Check max context length
    if (filteredContext.length > profile.maxContextLength) {
      filteredContext = filteredContext.substring(0, profile.maxContextLength);
      blockedReason = `Context truncated to max length ${profile.maxContextLength}`;
    }

    // Apply PII filtering (basic pattern matching)
    if (profile.piiFiltering) {
      const piiPatterns = [
        { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[SSN-REDACTED]' },
        { pattern: /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, replacement: '[EMAIL-REDACTED]' },
        { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, replacement: '[CARD-REDACTED]' },
        { pattern: /\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/g, replacement: '[PHONE-REDACTED]' },
      ];
      piiPatterns.forEach(p => {
        filteredContext = filteredContext.replace(p.pattern, p.replacement);
      });
    }

    // Apply credential filtering
    if (profile.credentialFiltering) {
      const credPatterns = [
        { pattern: /(?:password|passwd|pwd)\s*[=:]\s*\S+/gi, replacement: '[CREDENTIAL-REDACTED]' },
        { pattern: /(?:api[_-]?key|apikey)\s*[=:]\s*\S+/gi, replacement: '[API-KEY-REDACTED]' },
        { pattern: /(?:token|bearer)\s+[A-Za-z0-9\-._~+\/=]+/gi, replacement: '[TOKEN-REDACTED]' },
        { pattern: /(?:secret)\s*[=:]\s*\S+/gi, replacement: '[SECRET-REDACTED]' },
      ];
      credPatterns.forEach(p => {
        filteredContext = filteredContext.replace(p.pattern, p.replacement);
      });
    }

    // Apply custom rules (sorted by priority)
    for (const rule of rules) {
      let matched = false;
      const flags = rule.caseSensitive ? 'g' : 'gi';

      switch (rule.ruleType) {
        case 'keyword':
          const kwRegex = new RegExp(this.escapeRegex(rule.pattern), flags);
          matched = kwRegex.test(filteredContext);
          if (matched) {
            triggeredRuleIds.push(rule.id);
            if (rule.action === 'block') {
              blocked = true;
              blockedReason = `Blocked by rule: ${rule.ruleName}`;
            } else if (rule.action === 'mask') {
              filteredContext = filteredContext.replace(kwRegex, '[MASKED]');
            } else if (rule.action === 'warn') {
              this.logger.warn(`Context warning triggered by rule: ${rule.ruleName}`);
            }
          }
          break;

        case 'regex':
          try {
            const rx = new RegExp(rule.pattern, flags);
            matched = rx.test(filteredContext);
            if (matched) {
              triggeredRuleIds.push(rule.id);
              if (rule.action === 'block') {
                blocked = true;
                blockedReason = `Blocked by rule: ${rule.ruleName}`;
              } else if (rule.action === 'mask') {
                filteredContext = filteredContext.replace(rx, '[MASKED]');
              }
            }
          } catch (e) {
            this.logger.error(`Invalid regex in rule ${rule.id}: ${rule.pattern}`);
          }
          break;

        case 'url_domain':
          const urlRegex = new RegExp(`https?://[^/]*${this.escapeRegex(rule.pattern)}`, flags);
          matched = urlRegex.test(filteredContext);
          if (matched) {
            triggeredRuleIds.push(rule.id);
            if (rule.action === 'block') {
              blocked = true;
              blockedReason = `Blocked domain by rule: ${rule.ruleName}`;
            } else if (rule.action === 'mask') {
              filteredContext = filteredContext.replace(urlRegex, '[URL-BLOCKED]');
            }
          }
          break;

        case 'data_pattern':
          const dpRegex = new RegExp(rule.pattern, flags);
          matched = dpRegex.test(filteredContext);
          if (matched) {
            triggeredRuleIds.push(rule.id);
            if (rule.action === 'mask') {
              filteredContext = filteredContext.replace(dpRegex, '[DATA-MASKED]');
            } else if (rule.action === 'block') {
              blocked = true;
              blockedReason = `Blocked data pattern by rule: ${rule.ruleName}`;
            }
          }
          break;
      }
    }

    // Apply system prompt protection
    if (profile.systemPromptProtection) {
      const sysPromptPatterns = [
        { pattern: /system\s*prompt\s*:?\s*/gi, replacement: '[PROTECTED]' },
        { pattern: /you\s+are\s+a\s+/gi, replacement: '[PROTECTED-INSTRUCTION]' },
        { pattern: /instructions?\s*:\s*/gi, replacement: '[PROTECTED]' },
      ];
      sysPromptPatterns.forEach(p => {
        filteredContext = filteredContext.replace(p.pattern, p.replacement);
      });
    }

    const processingTimeMs = Date.now() - startTime;
    const filterResult = blocked ? 'blocked' : (triggeredRuleIds.length > 0 ? 'filtered' : 'allowed');

    // Log the filter action
    const log = new ContextFilterLog();
    log.agentId = dto.agentId;
    log.sessionId = dto.sessionId || null;
    log.filterResult = filterResult;
    log.originalContext = dto.context;
    log.filteredContext = blocked ? null : filteredContext;
    log.rulesTriggered = triggeredRuleIds.length;
    log.triggeredRuleIds = triggeredRuleIds;
    log.blockedReason = blockedReason;
    log.originalLength = dto.context.length;
    log.filteredLength = blocked ? 0 : filteredContext.length;
    log.processingTimeMs = processingTimeMs;
    const savedLog = await this.logRepo.save(log);

    this.logger.log(`Context filtered for agent ${dto.agentId}: ${filterResult} (${triggeredRuleIds.length} rules, ${processingTimeMs}ms)`);

    return {
      filterResult,
      filteredContext: blocked ? '' : filteredContext,
      rulesTriggered: triggeredRuleIds.length,
      triggeredRuleIds,
      blockedReason,
      originalLength: dto.context.length,
      filteredLength: blocked ? 0 : filteredContext.length,
      logId: savedLog.id,
    };
  }

  // ─── LOG QUERIES ───

  async findLogsByAgent(agentId: string, limit = 50): Promise<ContextFilterLog[]> {
    return this.logRepo.find({ where: { agentId }, order: { createdAt: 'DESC' }, take: limit });
  }

  async findLogById(id: string): Promise<ContextFilterLog> {
    const log = await this.logRepo.findOne({ where: { id } });
    if (!log) throw new NotFoundException(`Filter log ${id} not found`);
    return log;
  }

  // ─── STATS ───

  async getStats(): Promise<{
    totalRules: number;
    activeRules: number;
    totalProfiles: number;
    totalLogs: number;
    blockedCount: number;
    filteredCount: number;
    allowedCount: number;
    avgProcessingTimeMs: number | null;
  }> {
    const totalRules = await this.ruleRepo.count();
    const activeRules = await this.ruleRepo.count({ where: { status: 'active' } });
    const totalProfiles = await this.profileRepo.count();
    const totalLogs = await this.logRepo.count();
    const blockedCount = await this.logRepo.count({ where: { filterResult: 'blocked' } });
    const filteredCount = await this.logRepo.count({ where: { filterResult: 'filtered' } });
    const allowedCount = await this.logRepo.count({ where: { filterResult: 'allowed' } });

    const allLogs = await this.logRepo.find();
    const times = allLogs.map(l => l.processingTimeMs).filter((t): t is number => t !== null);
    const avgProcessingTimeMs = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : null;

    return { totalRules, activeRules, totalProfiles, totalLogs, blockedCount, filteredCount, allowedCount, avgProcessingTimeMs };
  }

  async getAgentStats(agentId: string): Promise<{
    rulesCount: number;
    logsCount: number;
    blockedCount: number;
    filteredCount: number;
    allowedCount: number;
    topTriggeredRules: { ruleId: string; count: number }[];
  }> {
    const rulesCount = await this.ruleRepo.count({ where: { agentId } });
    const logsCount = await this.logRepo.count({ where: { agentId } });
    const blockedCount = await this.logRepo.count({ where: { agentId, filterResult: 'blocked' } });
    const filteredCount = await this.logRepo.count({ where: { agentId, filterResult: 'filtered' } });
    const allowedCount = await this.logRepo.count({ where: { agentId, filterResult: 'allowed' } });

    const logs = await this.logRepo.find({ where: { agentId } });
    const ruleCounts: Record<string, number> = {};
    logs.forEach(l => {
      if (l.triggeredRuleIds && Array.isArray(l.triggeredRuleIds)) {
        l.triggeredRuleIds.forEach((rid: string) => {
          ruleCounts[rid] = (ruleCounts[rid] || 0) + 1;
        });
      }
    });
    const topTriggeredRules = Object.entries(ruleCounts)
      .map(([ruleId, count]) => ({ ruleId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { rulesCount, logsCount, blockedCount, filteredCount, allowedCount, topTriggeredRules };
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
