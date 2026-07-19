import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessibilityProfile } from '../entities/accessibility-profile.entity';

@Injectable()
export class AccessibilityProfileService {
  constructor(
    @InjectRepository(AccessibilityProfile)
    private readonly profileRepo: Repository<AccessibilityProfile>,
  ) {}

  async findAll(userId?: string): Promise<AccessibilityProfile[]> {
    return this.profileRepo.find({ where: userId ? { userId } as any : {} });
  }

  async findOne(id: string): Promise<AccessibilityProfile | null> {
    return this.profileRepo.findOneBy({ id });
  }

  async create(data: Partial<AccessibilityProfile>): Promise<AccessibilityProfile> {
    const entity = this.profileRepo.create(data);
    return this.profileRepo.save(entity);
  }

  async update(id: string, data: Partial<AccessibilityProfile>): Promise<AccessibilityProfile | null> {
    await this.profileRepo.update(id, data);
    return this.profileRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.profileRepo.delete(id);
  }
}
