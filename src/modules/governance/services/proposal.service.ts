import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposal } from '../entities/proposal.entity';
import { CreateProposalDto, UpdateProposalDto } from '../dto/create-proposal.dto';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
  ) {}

  async create(dto: CreateProposalDto): Promise<Proposal> {
    const proposal = this.proposalRepo.create(dto);
    proposal.voteCount = 0;
    proposal.approvalRate = 0;
    return this.proposalRepo.save(proposal);
  }

  async findAll(assemblyId?: string): Promise<Proposal[]> {
    const query = this.proposalRepo.createQueryBuilder('proposal');
    
    if (assemblyId) {
      query.where('proposal.assemblyId = :assemblyId', { assemblyId });
    }
    
    query.orderBy('proposal.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<Proposal> {
    const proposal = await this.proposalRepo.findOne({ 
      where: { id }, 
      relations: ['votes', 'assembly'] 
    });
    if (!proposal) throw new NotFoundException(`Proposal ${id} not found`);
    return proposal;
  }

  async update(id: string, dto: Partial<UpdateProposalDto>): Promise<Proposal> {
    const proposal = await this.findOne(id);
    Object.assign(proposal, dto);
    return this.proposalRepo.save(proposal);
  }

  async remove(id: string): Promise<void> {
    const proposal = await this.findOne(id);
    await this.proposalRepo.remove(proposal);
  }

  async submitForVoting(id: string): Promise<Proposal> {
    const proposal = await this.findOne(id);
    proposal.status = 'active';
    proposal.votingStartDate = new Date();
    return this.proposalRepo.save(proposal);
  }

  async closeVoting(id: string, results: { approved: number; rejected: number; abstained: number }): Promise<Proposal> {
    const proposal = await this.findOne(id);
    proposal.status = 'closed';
    proposal.outcome = JSON.stringify(results);
    
    const total = results.approved + results.rejected + results.abstained;
    proposal.approvalRate = total > 0 ? (results.approved / total) * 100 : 0;
    proposal.voteCount = total;
    
    return this.proposalRepo.save(proposal);
  }
}
