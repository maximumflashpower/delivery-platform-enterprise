import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { VoteService } from '../services/vote.service';
import { CreateVoteDto } from '../dto/create-vote.dto';
import { Vote } from '../entities/vote.entity';

@ApiTags('Governance - Votes')
@Controller('api/governance/votes')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  @ApiOperation({ summary: 'Cast a vote' })
  @ApiResponse({ status: 201, description: 'Vote cast successfully', type: Vote })
  async castVote(@Body() dto: CreateVoteDto): Promise<Vote> {
    return this.voteService.castVote(dto);
  }

  @Post(':id/revoke')
  @ApiOperation({ summary: 'Revoke a vote' })
  @ApiParam({ name: 'id', description: 'Vote UUID' })
  @ApiResponse({ status: 200, description: 'Vote revoked', type: Vote })
  async revokeVote(@Param('id') id: string): Promise<Vote> {
    return this.voteService.revokeVote(id);
  }

  @Get('proposal/:proposalId')
  @ApiOperation({ summary: 'Get all votes for a proposal' })
  @ApiParam({ name: 'proposalId', description: 'Proposal UUID' })
  @ApiResponse({ status: 200, description: 'List of votes', type: [Vote] })
  async findByProposal(@Param('proposalId') proposalId: string): Promise<Vote[]> {
    return this.voteService.findByProposal(proposalId);
  }

  @Get('proposal/:proposalId/tally')
  @ApiOperation({ summary: 'Get vote tally for a proposal' })
  @ApiParam({ name: 'proposalId', description: 'Proposal UUID' })
  @ApiResponse({ status: 200, description: 'Vote tally' })
  async tally(@Param('proposalId') proposalId: string): Promise<{
    yes: number;
    no: number;
    abstain: number;
    blank: number;
    total: number;
    approvalRate: number;
  }> {
    return this.voteService.tally(proposalId);
  }
}
