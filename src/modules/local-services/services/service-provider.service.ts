import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ServiceProvider } from '../entities/service-provider.entity';
import { ProviderStatus } from '../enums/provider-status.enum';

@Injectable()
export class ServiceProviderService {
  private readonly logger = new Logger(ServiceProviderService.name);

  constructor(
    @InjectRepository(ServiceProvider)
    private readonly providerRepo: Repository<ServiceProvider>,
  ) {}

  async findAll(): Promise<Array<{ id: string; providerCode: string; status: string; rating: number }>> {
    const providers = await this.providerRepo.find({ where: { deletedAt: IsNull() }, order: { createdAt: 'DESC' } });
    return providers.map(p => ({
      id: p.id,
      providerCode: p.providerCode,
      status: p.status,
      rating: Number(p.rating),
    }));
  }

  async findById(id: string): Promise<ServiceProvider> {
    const provider = await this.providerRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!provider) throw new NotFoundException(`Provider with ID ${id} not found`);
    return provider;
  }

  async findByUserId(userId: string): Promise<ServiceProvider[]> {
    return this.providerRepo.find({ where: { userId, deletedAt: IsNull() } });
  }

  async create(data: Partial<ServiceProvider>): Promise<ServiceProvider> {
    if (!data.providerCode) {
      throw new BadRequestException('providerCode is required');
    }
    const existing = await this.providerRepo.findOne({ where: { providerCode: data.providerCode } });
    if (existing && existing.deletedAt === null) {
      throw new BadRequestException(`Provider code ${data.providerCode} already exists`);
    }
    const provider = this.providerRepo.create(data);
    return this.providerRepo.save(provider);
  }

  async update(id: string, data: Partial<ServiceProvider>): Promise<ServiceProvider> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.providerRepo.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const provider = await this.findById(id);
    await this.providerRepo.softDelete(id);
  }

  async goOnline(id: string): Promise<ServiceProvider> {
    const provider = await this.findById(id);
    provider.status = ProviderStatus.AVAILABLE;
    return this.providerRepo.save(provider);
  }

  async goOffline(id: string): Promise<ServiceProvider> {
    const provider = await this.findById(id);
    provider.status = ProviderStatus.OFFLINE;
    return this.providerRepo.save(provider);
  }
}
