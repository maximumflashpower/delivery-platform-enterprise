import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../entities/vote.entity';
import { CreateVoteDto } from '../dto/create-vote.dto';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,
  ) {}

  async castVote(dto: CreateVoteDto): Promise<Vote> {
    // Check if user already voted on this proposal
    const existing = await this.voteRepo.findOne({
      where: {
        userId: dto.userId,
        proposalId: dto.proposalId,
        isValid: true,
      },
    });

    if (existing && !existing.revokedAt) {
      throw new ConflictException('User has already voted on this proposal');
    }

    // Invalidate previous vote if exists
    if (existing) {
      existing.isValid = false;
      existing.revokedAt = new Date();
      await this.voteRepo.save(existing);
    }

    const vote = this.voteRepo.create({
      ...dto,
      isValid: true,
      votedAt: new Date(),
    });

    return this.voteRepo.save(vote);
  }

  async revokeVote(voteId: string): Promise<Vote> {
    const vote = await this.voteRepo.findOne({ where: { id: voteId } });
    if (!vote) throw new NotFoundException(`Vote ${voteId} not found`);
    
    vote.isValid = false;
    vote.revokedAt = new Date();
    return this.voteRepo.save(vote);
  }

  async findByProposal(proposalId: string): Promise<Vote[]> {
    return this.voteRepo.find({
      where: { proposalId, isValid: true },
      relations: ['user'],
      order: { votedAt: 'ASC' },
    });
  }

  async tally(proposalId: string): Promise<{
    yes: number;
    no: number;
    abstain: number;
    blank: number;
    total: number;
    approvalRate: number;
  }> {
    const votes = await this.findByProposal(proposalId);
    
    const tally = votes.reduce((acc, vote) => {
      acc[vote.choice]++;
      acc.total += vote.weight;
      return acc;
    }, { yes: 0, no: 0, abstain: 0, blank: 0, total: 0 });

    const validVotes = tally.yes + tally.no;
    const approvalRate = validVotes > 0 ? (tally.yes / validVotes) * 100 : 0;

    return {
      yes: tally.yes,
      no: tally.no,
      abstain: tally.abstain,
      blank: tally.blank,
      total: tally.total,
      approvalRate: Number(approvalRate.toFixed(2)),
    };
  }
}
