import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityMembership, MembershipStatus, JoinReason } from '../entities/community-membership.entity';

@Injectable()
export class CommunityMembershipService {
  constructor(
    @InjectRepository(CommunityMembership)
    private readonly repo: Repository<CommunityMembership>,
  ) {}

  async requestJoin(communityId: string, userId: string, roleId: string, reason?: string): Promise<CommunityMembership> {
    const membership = this.repo.create({
      communityId,
      userId,
      role_id: roleId,
      status: MembershipStatus.PENDING,
      join_reason: (reason as JoinReason) || null
    });
    return this.repo.save(membership);
  }

  async approve(communityId: string, userId: string, approverId: string, comments?: string): Promise<CommunityMembership> {
    const membership = await this.repo.findOne({
      where: { communityId, userId, status: MembershipStatus.PENDING }
    });

    if (!membership) throw new NotFoundException('Pending membership not found');

    membership.status = MembershipStatus.APPROVED;
    membership.approvedBy = approverId;
    membership.approved_comments = comments || null;
    membership.joined_at = new Date();

    return this.repo.save(membership);
  }

  async reject(communityId: string, userId: string, approverId: string, reason: string): Promise<void> {
    const membership = await this.repo.findOne({
      where: { communityId, userId, status: MembershipStatus.PENDING }
    });

    if (!membership) throw new NotFoundException('Pending membership not found');

    membership.status = MembershipStatus.INACTIVE;
    membership.approvedBy = approverId;
    membership.approved_comments = reason;

    await this.repo.save(membership);
  }

  async leave(communityId: string, userId: string): Promise<CommunityMembership> {
    const membership = await this.repo.findOne({
      where: { communityId, userId }
    });

    if (!membership) throw new NotFoundException('Membership not found');

    membership.status = MembershipStatus.WITHDRAWN;
    membership.left_at = new Date();

    return this.repo.save(membership);
  }

  async suspend(communityId: string, userId: string, suspendedBy: string, until: Date, reason: string): Promise<CommunityMembership> {
    const membership = await this.repo.findOne({
      where: { communityId, userId }
    });

    if (!membership) throw new NotFoundException('Membership not found');

    membership.status = MembershipStatus.SUSPENDED;
    membership.suspended_until = until;
    membership.suspension_reason = reason;

    return this.repo.save(membership);
  }

  async unban(communityId: string, userId: string): Promise<CommunityMembership> {
    const membership = await this.repo.findOne({
      where: { communityId, userId }
    });

    if (!membership) throw new NotFoundException('Membership not found');

    membership.status = MembershipStatus.INACTIVE;
    membership.suspended_until = null;
    membership.suspension_reason = null;

    return this.repo.save(membership);
  }

  async findByUser(userId: string): Promise<CommunityMembership[]> {
    return this.repo.find({
      where: { userId },
      order: { joined_at: 'DESC' }
    });
  }

  async findByCommunity(communityId: string, limit = 100): Promise<CommunityMembership[]> {
    return this.repo.find({
      where: { communityId },
      order: { joined_at: 'ASC' },
      take: limit
    });
  }

  async isMember(communityId: string, userId: string): Promise<boolean> {
    const membership = await this.repo.findOne({
      where: {
        communityId,
        userId,
        status: MembershipStatus.APPROVED
      }
    });
    return !!membership;
  }
}
