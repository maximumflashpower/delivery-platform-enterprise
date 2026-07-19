import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Host } from '../entities/host.entity';
import { HostStatus } from '../enums/host-status.enum';

@Injectable()
export class HostService {
  private readonly logger = new Logger(HostService.name);

  constructor(
    @InjectRepository(Host)
    private readonly hostRepo: Repository<Host>,
  ) {}

  async findAll(): Promise<Array<{ id: string; hostCode: string; status: string; rating: number }>> {
    const hosts = await this.hostRepo.find({ where: { deletedAt: IsNull() }, order: { createdAt: 'DESC' } });
    return hosts.map(h => ({
      id: h.id,
      hostCode: h.hostCode,
      status: h.status,
      rating: Number(h.rating),
    }));
  }

  async findById(id: string): Promise<Host> {
    const host = await this.hostRepo.findOne({ 
      where: { id, deletedAt: IsNull() },
      relations: { listings: true } as any
    });
    if (!host) throw new NotFoundException(`Host with ID ${id} not found`);
    return host;
  }

  async findByUserId(userId: string): Promise<Host[]> {
    return this.hostRepo.find({ where: { userId, deletedAt: IsNull() } });
  }

  async create(data: Partial<Host>): Promise<Host> {
    if (!data.hostCode || !data.displayName) {
      throw new BadRequestException('hostCode and displayName are required');
    }
    const existing = await this.hostRepo.findOne({ where: { hostCode: data.hostCode } });
    if (existing && existing.deletedAt === null) {
      throw new BadRequestException(`Host code ${data.hostCode} already exists`);
    }
    const host = this.hostRepo.create(data);
    return this.hostRepo.save(host);
  }

  async update(id: string, data: Partial<Host>): Promise<Host> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.hostRepo.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const host = await this.findById(id);
    await this.hostRepo.softDelete(id);
  }

  async verify(id: string): Promise<Host> {
    const host = await this.findById(id);
    host.status = HostStatus.ACTIVE;
    return this.hostRepo.save(host);
  }

  async suspend(id: string, reason?: string): Promise<Host> {
    const host = await this.findById(id);
    host.status = HostStatus.SUSPENDED;
    return this.hostRepo.save(host);
  }

  async toggleSuperHost(id: string, isSuperHost: boolean): Promise<Host> {
    const host = await this.findById(id);
    host.isSuperHost = isSuperHost;
    return this.hostRepo.save(host);
  }
}
