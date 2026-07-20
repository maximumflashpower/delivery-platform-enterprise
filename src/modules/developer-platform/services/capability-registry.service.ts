import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Capability } from '../entities/capability.entity';
import { SourceAuthority } from '../entities/source-authority.entity';
import { CreateCapabilityDto } from '../dto/create-capability.dto';
import { CreateSourceAuthorityDto } from '../dto/create-source-authority.dto';

@Injectable()
export class CapabilityRegistryService {
  constructor(
    @InjectRepository(Capability)
    private readonly capabilityRepo: Repository<Capability>,
    @InjectRepository(SourceAuthority)
    private readonly authorityRepo: Repository<SourceAuthority>,
  ) {}

  // === Capability CRUD ===

  async findAllCapabilities(
    category?: string,
    isActive?: boolean,
  ): Promise<Capability[]> {
    const where: any = {};
    if (category !== undefined) where.category = category;
    if (isActive !== undefined) where.isActive = isActive;
    return this.capabilityRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findCapabilityById(id: string): Promise<Capability> {
    const cap = await this.capabilityRepo.findOne({ where: { id } });
    if (!cap) throw new NotFoundException(`Capability ${id} not found`);
    return cap;
  }

  async findCapabilityByKey(key: string): Promise<Capability> {
    const cap = await this.capabilityRepo.findOne({ where: { capabilityKey: key } });
    if (!cap) throw new NotFoundException(`Capability key "${key}" not found`);
    return cap;
  }

  async createCapability(dto: CreateCapabilityDto): Promise<Capability> {
    const cap = this.capabilityRepo.create(dto);
    return this.capabilityRepo.save(cap);
  }

  async updateCapability(id: string, dto: Partial<CreateCapabilityDto>): Promise<Capability> {
    const cap = await this.findCapabilityById(id);
    Object.assign(cap, dto);
    return this.capabilityRepo.save(cap);
  }

  async deleteCapability(id: string): Promise<void> {
    const cap = await this.findCapabilityById(id);
    await this.capabilityRepo.remove(cap);
  }

  // === Source Authority CRUD ===

  async findAllAuthorities(
    trustLevel?: string,
    isActive?: boolean,
  ): Promise<SourceAuthority[]> {
    const where: any = {};
    if (trustLevel !== undefined) where.trustLevel = trustLevel;
    if (isActive !== undefined) where.isActive = isActive;
    return this.authorityRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findAuthorityById(id: string): Promise<SourceAuthority> {
    const auth = await this.authorityRepo.findOne({ where: { id } });
    if (!auth) throw new NotFoundException(`SourceAuthority ${id} not found`);
    return auth;
  }

  async findAuthorityByKey(key: string): Promise<SourceAuthority> {
    const auth = await this.authorityRepo.findOne({ where: { authorityKey: key } });
    if (!auth) throw new NotFoundException(`Authority key "${key}" not found`);
    return auth;
  }

  async createAuthority(dto: CreateSourceAuthorityDto): Promise<SourceAuthority> {
    const auth = this.authorityRepo.create(dto);
    return this.authorityRepo.save(auth);
  }

  async updateAuthority(id: string, dto: Partial<CreateSourceAuthorityDto>): Promise<SourceAuthority> {
    const auth = await this.findAuthorityById(id);
    Object.assign(auth, dto);
    return this.authorityRepo.save(auth);
  }

  async deleteAuthority(id: string): Promise<void> {
    const auth = await this.findAuthorityById(id);
    await this.authorityRepo.remove(auth);
  }

  // === Registry Health ===

  async getRegistryHealth(): Promise<{
    totalCapabilities: number;
    activeCapabilities: number;
    criticalCapabilities: number;
    totalAuthorities: number;
    verifiedAuthorities: number;
  }> {
    const [totalCaps, activeCaps, criticalCaps, totalAuths, verifiedAuths] = await Promise.all([
      this.capabilityRepo.count(),
      this.capabilityRepo.count({ where: { isActive: true } }),
      this.capabilityRepo.count({ where: { isCritical: true } }),
      this.authorityRepo.count(),
      this.authorityRepo.count({ where: { verificationStatus: 'verified' } }),
    ]);

    return {
      totalCapabilities: totalCaps,
      activeCapabilities: activeCaps,
      criticalCapabilities: criticalCaps,
      totalAuthorities: totalAuths,
      verifiedAuthorities: verifiedAuths,
    };
  }
}
