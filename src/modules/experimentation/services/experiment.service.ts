import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experiment } from '../entities/experiment.entity';

@Injectable()
export class ExperimentService {
  constructor(
    @InjectRepository(Experiment)
    private readonly experimentRepo: Repository<Experiment>,
  ) {}

  async findAll(status?: string): Promise<Experiment[]> {
    return this.experimentRepo.find({ where: status ? { status } as any : {} });
  }

  async findOne(id: string): Promise<Experiment | null> {
    return this.experimentRepo.findOneBy({ id });
  }

  async create(data: Partial<Experiment>): Promise<Experiment> {
    const entity = this.experimentRepo.create(data);
    return this.experimentRepo.save(entity);
  }

  async update(id: string, data: Partial<Experiment>): Promise<Experiment | null> {
    await this.experimentRepo.update(id, data);
    return this.experimentRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.experimentRepo.delete(id);
  }
}
