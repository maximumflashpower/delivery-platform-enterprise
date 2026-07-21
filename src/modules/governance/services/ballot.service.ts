import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ballot } from '../entities/ballot.entity';

@Injectable()
export class BallotService {
  constructor(
    @InjectRepository(Ballot)
    private readonly repo: Repository<Ballot>,
  ) {}

  async create(data: {
    assemblyId: string;
    title: string;
    description?: string;
    options: string[];
    openingAt?: Date;
    closingAt?: Date;
  }): Promise<Ballot> {
    const ballot = new Ballot();
    Object.assign(ballot, {
      assemblyId: data.assemblyId,
      title: data.title,
      description: data.description || '',
      options: JSON.stringify(data.options),
      openingAt: data.openingAt || new Date(),
      closingAt: data.closingAt || null,
      status: 'open',
      results: JSON.stringify({}),
    });
    return this.repo.save(ballot);
  }

  async findByAssembly(assemblyId: string): Promise<Ballot[]> {
    return this.repo.find({
      where: { assemblyId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Ballot> {
    const ballot = await this.repo.findOne({ where: { id } });
    if (!ballot) throw new NotFoundException(`Ballot ${id} not found`);
    return ballot;
  }

  async close(id: string, results: Record<string, number>): Promise<Ballot> {
    const ballot = await this.findById(id);
    const update: any = {
      status: 'closed',
      results: JSON.stringify(results),
    };
    return this.repo.save(Object.assign(ballot, update));
  }

  async cancel(id: string, reason: string): Promise<Ballot> {
    const ballot = await this.findById(id);
    const update: any = {
      status: 'cancelled',
    };
    // Intentar agregar nota de cancelación si hay campo disponible
    const ballotAny: any = ballot;
    if (typeof ballotAny.details !== 'undefined') {
      update.details = `${ballotAny.details || ''}\nCancelled: ${reason}`;
    }
    return this.repo.save(Object.assign(ballot, update));
  }

  async getResults(id: string): Promise<any> {
    const ballot = await this.findById(id);
    const ballotAny: any = ballot;
    let parsedResults: Record<string, number> = {};
    if (ballotAny.results) {
      try {
        parsedResults = JSON.parse(ballotAny.results);
      } catch {
        parsedResults = {};
      }
    }
    return { ballot, parsedResults };
  }
}
