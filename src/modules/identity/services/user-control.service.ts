import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserControl } from '../entities/user-control.entity';
import { ControlAuditLog } from '../entities/control-audit-log.entity';
import { CreateUserControlDto } from '../dto/create-user-control.dto';
import { UpdateUserControlDto } from '../dto/update-user-control.dto';

@Injectable()
export class UserControlService {
  constructor(
    @InjectRepository(UserControl)
    private readonly controlRepo: Repository<UserControl>,
    @InjectRepository(ControlAuditLog)
    private readonly auditRepo: Repository<ControlAuditLog>,
  ) {}

  async create(dto: CreateUserControlDto, performedBy?: string): Promise<UserControl> {
    const control = new UserControl();
    control.userId = dto.userId;
    control.controlType = dto.controlType;
    control.scope = dto.scope || 'opt-in';
    control.isEnabled = dto.isEnabled ?? false;
    control.description = dto.description || '';
    control.conditions = dto.conditions || '';
    control.effectiveFrom = dto.effectiveFrom ? new Date(dto.effectiveFrom) : new Date();
    control.effectiveUntil = dto.effectiveUntil ? new Date(dto.effectiveUntil) : null;
    control.version = 1;
    control.modifiedBy = performedBy || null;
    control.lastModifiedAt = new Date();

    const saved = await this.controlRepo.save(control);

    await this.logAudit(saved.id, saved.userId, 'created', null, JSON.stringify(saved), performedBy);

    return saved;
  }

  async findByUser(userId: string): Promise<UserControl[]> {
    return this.controlRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<UserControl> {
    const control = await this.controlRepo.findOne({ where: { id } });
    if (!control) throw new NotFoundException(`UserControl ${id} not found`);
    return control;
  }

  async update(id: string, dto: UpdateUserControlDto, performedBy?: string): Promise<UserControl> {
    const control = await this.findById(id);
    const previousValue = JSON.stringify(control);

    Object.assign(control, dto);
    control.version += 1;
    control.lastModifiedAt = new Date();
    control.modifiedBy = performedBy || control.modifiedBy;

    if (dto.effectiveFrom) control.effectiveFrom = new Date(dto.effectiveFrom);
    if (dto.effectiveUntil) control.effectiveUntil = new Date(dto.effectiveUntil);

    const saved = await this.controlRepo.save(control);

    await this.logAudit(saved.id, saved.userId, 'updated', previousValue, JSON.stringify(saved), performedBy);

    return saved;
  }

  async enable(id: string, performedBy?: string): Promise<UserControl> {
    const control = await this.findById(id);
    const previousValue = JSON.stringify(control);
    control.isEnabled = true;
    control.lastModifiedAt = new Date();
    const saved = await this.controlRepo.save(control);
    await this.logAudit(saved.id, saved.userId, 'enabled', previousValue, JSON.stringify(saved), performedBy);
    return saved;
  }

  async disable(id: string, performedBy?: string): Promise<UserControl> {
    const control = await this.findById(id);
    const previousValue = JSON.stringify(control);
    control.isEnabled = false;
    control.lastModifiedAt = new Date();
    const saved = await this.controlRepo.save(control);
    await this.logAudit(saved.id, saved.userId, 'disabled', previousValue, JSON.stringify(saved), performedBy);
    return saved;
  }

  async remove(id: string, performedBy?: string): Promise<void> {
    const control = await this.findById(id);
    await this.logAudit(control.id, control.userId, 'revoked', JSON.stringify(control), null, performedBy);
    await this.controlRepo.remove(control);
  }

  async getAuditTrail(controlId: string): Promise<ControlAuditLog[]> {
    return this.auditRepo.find({
      where: { controlId },
      order: { createdAt: 'DESC' },
    });
  }

  private async logAudit(
    controlId: string,
    userId: string,
    action: string,
    previousValue: string | null,
    newValue: string | null,
    performedBy?: string,
  ): Promise<void> {
    const log = new ControlAuditLog();
    log.controlId = controlId;
    log.userId = userId;
    log.action = action as any;
    log.previousValue = previousValue;
    log.newValue = newValue;
    log.performedBy = performedBy || null;
    log.source = 'api';
    await this.auditRepo.save(log);
  }
}
