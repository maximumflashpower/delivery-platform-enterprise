import { Controller, Get, Post, Body, Patch, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommunityMembershipService } from '../services/community-membership.service';
import { CommunityMembership, MembershipStatus } from '../entities/community-membership.entity';

@ApiTags('community-memberships')
@Controller('role-profile/memberships')
export class CommunityMembershipController {
  constructor(private readonly service: CommunityMembershipService) {}

  @Post('join')
  @ApiOperation({ summary: 'Request to join a community' })
  @ApiResponse({ status: 201, type: CommunityMembership })
  requestJoin(
    @Body('communityId') communityId: string,
    @Body('userId') userId: string,
    @Body('roleId') roleId: string,
    @Body('reason') reason?: string
  ): Promise<CommunityMembership> {
    return this.service.requestJoin(communityId, userId, roleId, reason);
  }

  @Post('approve')
  @ApiOperation({ summary: 'Approve a membership request' })
  @ApiResponse({ status: 200, type: CommunityMembership })
  approve(
    @Body('communityId') communityId: string,
    @Body('userId') userId: string,
    @Body('approverId') approverId: string,
    @Body('comments') comments?: string
  ): Promise<CommunityMembership> {
    return this.service.approve(communityId, userId, approverId, comments);
  }

  @Post('reject')
  @ApiOperation({ summary: 'Reject a membership request' })
  @ApiResponse({ status: 200 })
  reject(
    @Body('communityId') communityId: string,
    @Body('userId') userId: string,
    @Body('approverId') approverId: string,
    @Body('reason') reason: string
  ): Promise<void> {
    return this.service.reject(communityId, userId, approverId, reason);
  }

  @Post('leave')
  @ApiOperation({ summary: 'Leave a community' })
  @ApiResponse({ status: 200, type: CommunityMembership })
  leave(@Body('communityId') communityId: string, @Body('userId') userId: string): Promise<CommunityMembership> {
    return this.service.leave(communityId, userId);
  }

  @Post('suspend')
  @ApiOperation({ summary: 'Suspend a membership' })
  @ApiResponse({ status: 200, type: CommunityMembership })
  suspend(
    @Body('communityId') communityId: string,
    @Body('userId') userId: string,
    @Body('suspendedBy') suspendedBy: string,
    @Body('until') until: string,
    @Body('reason') reason: string
  ): Promise<CommunityMembership> {
    return this.service.suspend(communityId, userId, suspendedBy, new Date(until), reason);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all memberships for a user' })
  @ApiResponse({ status: 200, type: [CommunityMembership] })
  findByUser(@Param('userId') userId: string): Promise<CommunityMembership[]> {
    return this.service.findByUser(userId);
  }

  @Get('community/:communityId')
  @ApiOperation({ summary: 'Get all members of a community' })
  @ApiResponse({ status: 200, type: [CommunityMembership] })
  findByCommunity(@Param('communityId') communityId: string, @Query('limit') limit?: number): Promise<CommunityMembership[]> {
    return this.service.findByCommunity(communityId, limit ? parseInt(String(limit)) : 100);
  }

  @Get('check/:communityId/:userId')
  @ApiOperation({ summary: 'Check if user is a member' })
  @ApiResponse({ status: 200 })
  isMember(@Param('communityId') communityId: string, @Param('userId') userId: string): Promise<boolean> {
    return this.service.isMember(communityId, userId);
  }
}
