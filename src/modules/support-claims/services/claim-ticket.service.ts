import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ClaimTicket } from '../entities/claim-ticket.entity';

@Injectable()
export class ClaimTicketService {
  private readonly logger = new Logger(ClaimTicketService.name);

  constructor(
    @InjectRepository(ClaimTicket)
    private readonly ticketRepo: Repository<ClaimTicket>,
  ) {}

  async findAll(): Promise<ClaimTicket[]> {
    return this.ticketRepo.find({ where: { deletedAt: IsNull() }, relations: ['claim'], order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<ClaimTicket> {
    const t = await this.ticketRepo.findOne({ where: { id, deletedAt: IsNull() }, relations: ['claim'] });
    if (!t) throw new NotFoundException(`Ticket with ID ${id} not found`);
    return t;
  }

  async findByClaimId(claimId: string): Promise<ClaimTicket[]> {
    return this.ticketRepo.find({ 
      where: { claimId, deletedAt: IsNull() }, 
      relations: ['claim'],
      order: { createdAt: 'ASC' }
    });
  }

  async create(data: Partial<ClaimTicket>): Promise<ClaimTicket> {
    if (!data.claimId || !data.message) {
      throw new BadRequestException('claimId and message are required');
    }
    return this.ticketRepo.save(this.ticketRepo.create(data));
  }

  async update(id: string, data: Partial<ClaimTicket>): Promise<ClaimTicket> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.ticketRepo.update(id, data);
    return this.findById(id);
  }
}
