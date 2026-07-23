import { Injectable, Logger, NotFoundException, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RateLimitConfig } from '../entities/rate-limit-config.entity';
import { RateLimitUsage } from '../entities/rate-limit-usage.entity';
import { CircuitBreakerState } from '../entities/circuit-breaker-state.entity';
import { CreateRateLimitConfigDto, CheckRateLimitDto, RecordUsageDto } from '../dto/rate-limit.dto';

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);
  private readonly minuteWindowMs = 60 * 1000;
  private readonly hourWindowMs = 60 * 60 * 1000;
  private readonly dayWindowMs = 24 * 60 * 60 * 1000;

  constructor(
    @InjectRepository(RateLimitConfig)
    private readonly configRepo: Repository<RateLimitConfig>,
    @InjectRepository(RateLimitUsage)
    private readonly usageRepo: Repository<RateLimitUsage>,
    @InjectRepository(CircuitBreakerState)
    private readonly circuitRepo: Repository<CircuitBreakerState>,
  ) {}

  // ─── CONFIG MANAGEMENT ───

  async createConfig(dto: CreateRateLimitConfigDto): Promise<RateLimitConfig> {
    const existing = await this.configRepo.findOne({ 
      where: { agentId: dto.agentId, status: 'active' } 
    });
    if (existing) {
      throw new BadRequestException(`Active rate limit config already exists for agent ${dto.agentId}`);
    }

    const config = new RateLimitConfig();
    Object.assign(config, dto);
    config.status = 'active';
    config.excessAction = dto.excessAction || 'reject';
    config.circuitBreakerEnabled = dto.circuitBreakerEnabled ?? true;
    config.burstSize = dto.burstSize || 10;
    config.cooldownMs = dto.cooldownMs || 5000;
    return this.configRepo.save(config);
  }

  async getConfigByAgent(agentId: string): Promise<RateLimitConfig> {
    const config = await this.configRepo.findOne({ where: { agentId, status: 'active' } });
    if (!config) throw new NotFoundException(`No active rate limit config for agent ${agentId}`);
    return config;
  }

  async updateConfig(id: string, partial: Partial<RateLimitConfig>): Promise<RateLimitConfig> {
    const config = await this.getConfigById(id);
    Object.assign(config, partial);
    return this.configRepo.save(config);
  }

  async getConfigById(id: string): Promise<RateLimitConfig> {
    const config = await this.configRepo.findOne({ where: { id } });
    if (!config) throw new NotFoundException(`Rate limit config ${id} not found`);
    return config;
  }

  // ─── RATE LIMIT CHECKING ───

  async checkRateLimit(dto: CheckRateLimitDto): Promise<{
    allowed: boolean;
    remainingRequests: number;
    remainingTokens: number;
    resetAt: Date;
    reason: string | null;
    circuitOpen: boolean;
  }> {
    const config = await this.getConfigByAgent(dto.agentId);
    
    // Check circuit breaker first
    const circuitOpen = await this.isCircuitOpen(dto.agentId);
    if (circuitOpen) {
      return {
        allowed: false,
        remainingRequests: 0,
        remainingTokens: 0,
        resetAt: new Date(),
        reason: 'Circuit breaker is open',
        circuitOpen: true,
      };
    }

    // Get current window usage
    const now = new Date();
    const minuteWindow = this.getWindowStart(now, this.minuteWindowMs);
    const hourWindow = this.getWindowStart(now, this.hourWindowMs);
    const dayWindow = this.getWindowStart(now, this.dayWindowMs);

    const [minuteUsage, hourUsage, dayUsage] = await Promise.all([
      this.getUsageForWindow(dto.agentId, 'minute', minuteWindow),
      this.getUsageForWindow(dto.agentId, 'hour', hourWindow),
      this.getUsageForWindow(dto.agentId, 'day', dayWindow),
    ]);

    const minuteRequests = minuteUsage?.requestCount || 0;
    const hourRequests = hourUsage?.requestCount || 0;
    const dayRequests = dayUsage?.requestCount || 0;
    
    const minuteTokens = minuteUsage?.tokenCount || 0;
    const hourTokens = hourUsage?.tokenCount || 0;
    const dayTokens = dayUsage?.tokenCount || 0;

    const tokenEstimate = dto.tokenEstimate || 0;

    // Check request limits
    if (minuteRequests >= config.maxRequestsPerMinute) {
      return {
        allowed: false,
        remainingRequests: 0,
        remainingTokens: Math.max(0, config.maxTokensPerMinute - minuteTokens),
        resetAt: new Date(minuteWindow.getTime() + this.minuteWindowMs),
        reason: `Rate limit exceeded: ${config.maxRequestsPerMinute} requests/minute`,
        circuitOpen: false,
      };
    }
    if (hourRequests >= config.maxRequestsPerHour) {
      return {
        allowed: false,
        remainingRequests: 0,
        remainingTokens: Math.max(0, config.maxTokensPerHour - hourTokens),
        resetAt: new Date(hourWindow.getTime() + this.hourWindowMs),
        reason: `Rate limit exceeded: ${config.maxRequestsPerHour} requests/hour`,
        circuitOpen: false,
      };
    }
    if (dayRequests >= config.maxRequestsPerDay) {
      return {
        allowed: false,
        remainingRequests: 0,
        remainingTokens: Math.max(0, config.maxTokensPerDay - dayTokens),
        resetAt: new Date(dayWindow.getTime() + this.dayWindowMs),
        reason: `Rate limit exceeded: ${config.maxRequestsPerDay} requests/day`,
        circuitOpen: false,
      };
    }

    // Check token limits
    if (minuteTokens + tokenEstimate > config.maxTokensPerMinute) {
      return {
        allowed: false,
        remainingRequests: Math.max(0, config.maxRequestsPerMinute - minuteRequests),
        remainingTokens: 0,
        resetAt: new Date(minuteWindow.getTime() + this.minuteWindowMs),
        reason: `Token limit exceeded: ${config.maxTokensPerMinute} tokens/minute`,
        circuitOpen: false,
      };
    }
    if (hourTokens + tokenEstimate > config.maxTokensPerHour) {
      return {
        allowed: false,
        remainingRequests: Math.max(0, config.maxRequestsPerHour - hourRequests),
        remainingTokens: 0,
        resetAt: new Date(hourWindow.getTime() + this.hourWindowMs),
        reason: `Token limit exceeded: ${config.maxTokensPerHour} tokens/hour`,
        circuitOpen: false,
      };
    }
    if (dayTokens + tokenEstimate > config.maxTokensPerDay) {
      return {
        allowed: false,
        remainingRequests: Math.max(0, config.maxRequestsPerDay - dayRequests),
        remainingTokens: 0,
        resetAt: new Date(dayWindow.getTime() + this.dayWindowMs),
        reason: `Token limit exceeded: ${config.maxTokensPerDay} tokens/day`,
        circuitOpen: false,
      };
    }

    return {
      allowed: true,
      remainingRequests: Math.min(
        config.maxRequestsPerMinute - minuteRequests,
        config.maxRequestsPerHour - hourRequests,
        config.maxRequestsPerDay - dayRequests,
      ),
      remainingTokens: Math.min(
        config.maxTokensPerMinute - minuteTokens,
        config.maxTokensPerHour - hourTokens,
        config.maxTokensPerDay - dayTokens,
      ),
      resetAt: new Date(minuteWindow.getTime() + this.minuteWindowMs),
      reason: null,
      circuitOpen: false,
    };
  }

  // ─── USAGE RECORDING ───

  async recordUsage(dto: RecordUsageDto): Promise<RateLimitUsage> {
    const config = await this.getConfigByAgent(dto.agentId);
    const now = new Date();

    // Create/update usage records for each window
    const minuteWindow = this.getWindowStart(now, this.minuteWindowMs);
    const hourWindow = this.getWindowStart(now, this.hourWindowMs);
    const dayWindow = this.getWindowStart(now, this.dayWindowMs);

    await Promise.all([
      this.upsertUsage(dto.agentId, 'minute', minuteWindow, dto),
      this.upsertUsage(dto.agentId, 'hour', hourWindow, dto),
      this.upsertUsage(dto.agentId, 'day', dayWindow, dto),
    ]);

    // Update circuit breaker state
    if (config.circuitBreakerEnabled) {
      await this.updateCircuitBreaker(dto.agentId, !dto.success, dto.failureReason);
    }

    const log = new RateLimitUsage();
    log.agentId = dto.agentId;
    log.sessionId = dto.sessionId || null;
    log.windowType = 'record';
    log.windowStart = now;
    log.requestCount = 1;
    log.tokenCount = dto.tokensUsed;
    log.costAmount = dto.costAmount || 0;
    log.rejectedCount = 0;
    log.throttledCount = 0;
    log.avgResponseTimeMs = dto.responseTimeMs || null;
    log.status = dto.success ? 'normal' : 'error';
    
    return this.usageRepo.save(log);
  }

  // ─── CIRCUIT BREAKER ───

  async isCircuitOpen(agentId: string): Promise<boolean> {
    const config = await this.getConfigByAgent(agentId);
    if (!config.circuitBreakerEnabled) return false;

    const state = await this.getCircuitState(agentId);
    if (state.state === 'open') {
      // Check if timeout has passed
      if (state.openedAt) {
        const elapsed = Date.now() - state.openedAt.getTime();
        if (elapsed >= config.circuitBreakerTimeoutMs) {
          // Transition to half-open
          await this.transitionToHalfOpen(agentId);
          return false;
        }
        return true;
      }
    }
    return false;
  }

  async forceOpenCircuit(agentId: string, reason?: string): Promise<CircuitBreakerState> {
    const state = await this.getCircuitState(agentId);
    state.state = 'open';
    state.failureCount = state.failureCount + 1;
    state.lastFailureAt = new Date();
    state.openedAt = new Date();
    state.failureReason = reason || 'Manual force open';
    return this.circuitRepo.save(state);
  }

  async closeCircuit(agentId: string): Promise<CircuitBreakerState> {
    const state = await this.getCircuitState(agentId);
    state.state = 'closed';
    state.failureCount = 0;
    state.consecutiveSuccessCount = 0;
    state.openedAt = null;
    state.failureReason = null;
    return this.circuitRepo.save(state);
  }

  // ─── UTILITIES ───

  async getUsageStats(agentId: string): Promise<{
    totalRequestsToday: number;
    totalTokensToday: number;
    totalCostToday: number;
    rejectedToday: number;
    throttledToday: number;
    configsCount: number;
    activeConfigs: number;
  }> {
    const now = new Date();
    const dayWindow = this.getWindowStart(now, this.dayWindowMs);
    
    const dailyUsage = await this.getUsageForWindow(agentId, 'day', dayWindow);
    const configs = await this.configRepo.find({ where: { agentId } });
    const activeConfigs = await this.configRepo.count({ where: { agentId, status: 'active' } });

    return {
      totalRequestsToday: dailyUsage?.requestCount || 0,
      totalTokensToday: dailyUsage?.tokenCount || 0,
      totalCostToday: Number(dailyUsage?.costAmount || 0),
      rejectedToday: dailyUsage?.rejectedCount || 0,
      throttledToday: dailyUsage?.throttledCount || 0,
      configsCount: configs.length,
      activeConfigs,
    };
  }

  async listConfigs(): Promise<RateLimitConfig[]> {
    return this.configRepo.find({ order: { createdAt: 'DESC' } });
  }

  async resetUsage(agentId: string, sessionId?: string): Promise<void> {
    const now = new Date();
    const minuteWindow = this.getWindowStart(now, this.minuteWindowMs);
    
    if (sessionId) {
      await this.usageRepo.delete({ agentId, sessionId, windowStart: minuteWindow });
    } else {
      await this.usageRepo.delete({ agentId, windowStart: minuteWindow });
    }
  }

  private getWindowStart(date: Date, windowMs: number): Date {
    const timestamp = Math.floor(date.getTime() / windowMs) * windowMs;
    return new Date(timestamp);
  }

  private async getUsageForWindow(agentId: string, windowType: string, windowStart: Date): Promise<RateLimitUsage | null> {
    return this.usageRepo.findOne({ 
      where: { agentId, windowType, windowStart } 
    });
  }

  private async upsertUsage(agentId: string, windowType: string, windowStart: Date, dto: RecordUsageDto): Promise<void> {
    let usage = await this.getUsageForWindow(agentId, windowType, windowStart);
    
    if (!usage) {
      usage = new RateLimitUsage();
      usage.agentId = agentId;
      usage.windowType = windowType;
      usage.windowStart = windowStart;
    }

    usage.requestCount += 1;
    usage.tokenCount += dto.tokensUsed;
    usage.costAmount = Number(usage.costAmount) + Number(dto.costAmount || 0);
    if (!dto.success) usage.rejectedCount += 1;

    if (dto.responseTimeMs !== undefined && dto.responseTimeMs !== null) {
      const currentAvg = usage.avgResponseTimeMs || 0;
      const totalCount = usage.requestCount;
      usage.avgResponseTimeMs = ((currentAvg * (totalCount - 1)) + dto.responseTimeMs) / totalCount;
    }

    await this.usageRepo.save(usage);
  }

  async getCircuitState(agentId: string): Promise<CircuitBreakerState> {
    let state = await this.circuitRepo.findOne({ where: { agentId } });
    if (!state) {
      state = new CircuitBreakerState();
      state.agentId = agentId;
      state.state = 'closed';
      state.failureCount = 0;
      state.consecutiveSuccessCount = 0;
    }
    return state;
  }

  private async updateCircuitBreaker(agentId: string, failed: boolean, failureReason?: string): Promise<void> {
    const config = await this.getConfigByAgent(agentId);
    const state = await this.getCircuitState(agentId);

    if (failed) {
      state.failureCount += 1;
      state.lastFailureAt = new Date();
      state.consecutiveSuccessCount = 0;
      state.failureReason = failureReason || 'Request failure';

      if (state.failureCount >= config.circuitBreakerThreshold && state.state !== 'open') {
        state.state = 'open';
        state.openedAt = new Date();
        this.logger.warn(`Circuit breaker OPENED for agent ${agentId} (failure count: ${state.failureCount})`);
      }
    } else {
      state.consecutiveSuccessCount += 1;
      if (state.state === 'half-open' && state.consecutiveSuccessCount >= 3) {
        state.state = 'closed';
        state.failureCount = 0;
        state.openedAt = null;
        this.logger.log(`Circuit breaker CLOSED for agent ${agentId}`);
      }
    }

    state.lastCheckedAt = new Date();
    await this.circuitRepo.save(state);
  }

  private async transitionToHalfOpen(agentId: string): Promise<void> {
    const state = await this.getCircuitState(agentId);
    state.state = 'half-open';
    state.consecutiveSuccessCount = 0;
    this.logger.log(`Circuit breaker HALF-OPEN for agent ${agentId}`);
    await this.circuitRepo.save(state);
  }
}
