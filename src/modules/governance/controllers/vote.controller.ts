import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { VoteService } from '../services/vote.service';
import { Vote } from '../entities/vote.entity';

@ApiTags('Governance - Votes')
@Controller('governance/votes')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  @ApiOperation({ summary: 'Cast a vote' })
  @ApiResponse({ status: 201, description: 'Vote cast successfully', type: Vote })
  async castVote(@Body() dto: any): Promise<Vote> {
    return this.voteService.castVote(
      dto.userId,
      dto.proposalId,
      dto.choice,
      dto.ballotId,
    );
  }

  @Get('proposal/:proposalId')
  @ApiOperation({ summary: 'Get all votes for a proposal' })
  @ApiParam({ name: 'proposalId', description: 'Proposal UUID' })
  @ApiResponse({ status: 200, description: 'List of votes', type: [Vote] })
  async findByProposal(@Param('proposalId') proposalId: string): Promise<Vote[]> {
    return this.voteService.findByProposal(proposalId);
  }

  @Post(':id/revoke')
  @ApiOperation({ summary: 'Revoke a vote' })
  @ApiParam({ name: 'id', description: 'Vote UUID' })
  @ApiResponse({ status: 200, description: 'Vote revoked', type: Vote })
  async revokeVote(@Param('id') voteId: string): Promise<Vote> {
    return this.voteService.revokeVote(voteId);
  }

  @Get('proposal/:proposalId/tally')
  @ApiOperation({ summary: 'Get vote tally/results' })
  @ApiParam({ name: 'proposalId', description: 'Proposal UUID' })
  @ApiResponse({ status: 200, description: 'Vote tally' })
  async tally(@Param('proposalId') proposalId: string): Promise<Record<string, number>> {
    return this.voteService.tally(proposalId);
  }

  @Get('proposal/:proposalId/count')
  @ApiOperation({ summary: 'Get vote count for a proposal' })
  @ApiParam({ name: 'proposalId', description: 'Proposal UUID' })
  @ApiResponse({ status: 200, description: 'Vote count' })
  async count(@Param('proposalId') proposalId: string): Promise<number> {
    return this.voteService.count(proposalId);
  }
}
