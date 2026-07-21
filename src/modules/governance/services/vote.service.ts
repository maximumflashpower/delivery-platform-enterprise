import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../entities/vote.entity';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,
  ) {}

  async castVote(userId: string, proposalId: string, choice?: string, ballotId?: string): Promise<Vote> {
    const existing = await this.voteRepo.findOne({
      where: { userId, proposalId },
    });

    if (existing && !existing.revokedAt) {
      throw new BadRequestException('User has already voted on this proposal');
    }

    const vote = new Vote();
    vote.userId = userId;
    vote.proposalId = proposalId;
    vote.ballotId = ballotId || null;
    vote.choice = choice || null;
    vote.isValid = true;
    vote.weight = 1;
    vote.votedAt = new Date();

    return this.voteRepo.save(vote);
  }

  async revokeVote(voteId: string): Promise<Vote> {
    const vote = await this.voteRepo.findOne({ where: { id: voteId } });
    if (!vote) throw new NotFoundException(`Vote ${voteId} not found`);

    vote.revokedAt = new Date();
    vote.isValid = false;
    return this.voteRepo.save(vote);
  }

  async findByProposal(proposalId: string): Promise<Vote[]> {
    return this.voteRepo.find({
      where: { proposalId, isValid: true },
      order: { votedAt: 'ASC' },
    });
  }

  async tally(proposalId: string): Promise<Record<string, number>> {
    return this.getResults(proposalId);
  }

  async getResults(proposalId: string): Promise<Record<string, number>> {
    const votes = await this.findByProposal(proposalId);
    const results: Record<string, number> = {};
    for (const vote of votes) {
      if (vote.choice) {
        results[vote.choice] = (results[vote.choice] || 0) + 1;
      }
    }
    return results;
  }

  async count(proposalId: string): Promise<number> {
    return this.voteRepo.count({
      where: { proposalId, isValid: true },
    });
  }
}
