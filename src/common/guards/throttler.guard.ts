import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ThrottlerGuardCustom extends ThrottlerGuard {
  constructor(throttlerStorage: any, reflector: Reflector) {
    super({ throttlerStorage, reflector } as any);
  }

  protected async getTracker(req: any): Promise<string> {
    // Usar IP del cliente, considerar X-Forwarded-For para proxies
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';
    return Array.isArray(ip) ? ip[0] : ip;
  }

  protected async shouldSkip(_context: ExecutionContext): Promise<boolean> {
    // Skip health checks
    return false;
  }
}
