import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DomainOwner } from '../entities/domain-owner.entity';

@Injectable()
export class DomainOwnerService {
  constructor(
    @InjectRepository(DomainOwner)
    private readonly domainOwnerRepo: Repository<DomainOwner>,
  ) {}

  async create(ownerData: Partial<DomainOwner>): Promise<DomainOwner> {
    const owner = this.domainOwnerRepo.create(ownerData);
    return this.domainOwnerRepo.save(owner);
  }

  async findAll(): Promise<DomainOwner[]> {
    return this.domainOwnerRepo.find({ relations: ['release_gates'], where: { is_active: true } });
  }

  async findOne(id: string): Promise<DomainOwner> {
    const owner = await this.domainOwnerRepo.findOne({ where: { id }, relations: ['release_gates'] });
    if (!owner) throw new NotFoundException(`DomainOwner ${id} not found`);
    return owner;
  }

  async findByDomain(domain: string): Promise<DomainOwner> {
    const owner = await this.domainOwnerRepo.findOne({ where: { domain } });
    if (!owner) throw new NotFoundException(`DomainOwner for domain "${domain}" not found`);
    return owner;
  }

  async update(id: string, updates: Partial<DomainOwner>): Promise<DomainOwner> {
    const owner = await this.findOne(id);
    Object.assign(owner, updates);
    return this.domainOwnerRepo.save(owner);
  }

  async deactivate(id: string): Promise<DomainOwner> {
    const owner = await this.findOne(id);
    owner.is_active = false;
    return this.domainOwnerRepo.save(owner);
  }
}
