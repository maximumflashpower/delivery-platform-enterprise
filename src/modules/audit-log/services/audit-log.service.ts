import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
  ) {}

  async findAll(userId?: string, limit = 100): Promise<AuditLog[]> {
    return this.auditLogRepo.find({ where: userId ? { userId } as any : {}, take: limit, order: { createdAt: 'DESC' } as any });
  }

  async findOne(id: string): Promise<AuditLog | null> {
    return this.auditLogRepo.findOneBy({ id });
  }

  async create(data: Partial<AuditLog>): Promise<AuditLog> {
    const entity = this.auditLogRepo.create(data);
    return this.auditLogRepo.save(entity);
  }
}
