import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community, CommunityType, MembershipApproval } from '../entities/community.entity';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private readonly repo: Repository<Community>,
  ) {}

  async create(data: Partial<Community>): Promise<Community> {
    const community = this.repo.create(data);
    return this.repo.save(community);
  }

  async findAll(type?: CommunityType): Promise<Community[]> {
    if (type) {
      return this.repo.find({ where: { community_type: type, is_active: true }, order: { createdAt: 'DESC' } });
    }
    return this.repo.find({ where: { is_active: true }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Community> {
    const community = await this.repo.findOne({ where: { id } });
    if (!community) throw new NotFoundException(`Community ${id} not found`);
    return community;
  }

  async findBySlug(slug: string): Promise<Community> {
    const community = await this.repo.findOne({ where: { slug } });
    if (!community) throw new NotFoundException(`Community with slug "${slug}" not found`);
    return community;
  }

  async update(id: string, updates: Partial<Community>): Promise<Community> {
    const community = await this.findOne(id);
    Object.assign(community, updates);
    return this.repo.save(community);
  }

  async archive(id: string): Promise<Community> {
    const community = await this.findOne(id);
    community.is_active = false;
    community.archived_at = new Date();
    return this.repo.save(community);
  }

  async incrementMemberCount(id: string): Promise<Community> {
    const community = await this.findOne(id);
    community.member_count += 1;
    return this.repo.save(community);
  }

  async decrementMemberCount(id: string): Promise<Community> {
    const community = await this.findOne(id);
    community.member_count = Math.max(0, community.member_count - 1);
    return this.repo.save(community);
  }
}
