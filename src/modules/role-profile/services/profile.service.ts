import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile, ProfileVisibility, ProfileVerificationLevel } from '../entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repo: Repository<Profile>,
  ) {}

  async getOrCreate(userId: string): Promise<Profile> {
    let profile = await this.repo.findOne({ where: { userId } });
    
    if (!profile) {
      profile = this.repo.create({ userId, is_complete: false });
      return this.repo.save(profile);
    }
    
    return profile;
  }

  async update(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const profile = await this.getOrCreate(userId);
    Object.assign(profile, updates);
    return this.repo.save(profile);
  }

  async verify(userId: string, level: ProfileVerificationLevel, verifiedBy: string): Promise<Profile> {
    const profile = await this.getOrCreate(userId);
    profile.verification_level = level;
    profile.verified_at = new Date();
    return this.repo.save(profile);
  }

  async delete(userId: string): Promise<void> {
    const profile = await this.repo.findOne({ where: { userId } });
    if (profile) {
      profile.is_active = false;
      await this.repo.save(profile);
    }
  }

  async findById(id: string): Promise<Profile> {
    const profile = await this.repo.findOne({ where: { id } });
    if (!profile) throw new NotFoundException(`Profile ${id} not found`);
    return profile;
  }

  async findByUserId(userId: string): Promise<Profile> {
    const profile = await this.repo.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException(`Profile for user ${userId} not found`);
    return profile;
  }

  async getPublicProfiles(limit = 50): Promise<Profile[]> {
    return this.repo.find({
      where: { visibility: ProfileVisibility.PUBLIC, is_active: true },
      select: ['id', 'userId', 'display_name', 'bio', 'avatar_url', 'skills', 'interests', 'location'],
      take: limit
    });
  }
}
