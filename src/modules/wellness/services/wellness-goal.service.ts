import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WellnessGoal } from '../entities/wellness-goal.entity';

@Injectable()
export class WellnessGoalService {
  constructor(
    @InjectRepository(WellnessGoal)
    private readonly goalRepo: Repository<WellnessGoal>,
  ) {}

  async findAll(userId?: string): Promise<WellnessGoal[]> {
    return this.goalRepo.find({ where: userId ? { userId } as any : {} });
  }

  async findOne(id: string): Promise<WellnessGoal | null> {
    return this.goalRepo.findOneBy({ id });
  }

  async create(data: Partial<WellnessGoal>): Promise<WellnessGoal> {
    const entity = this.goalRepo.create(data);
    return this.goalRepo.save(entity);
  }

  async update(id: string, data: Partial<WellnessGoal>): Promise<WellnessGoal | null> {
    await this.goalRepo.update(id, data);
    return this.goalRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.goalRepo.delete(id);
  }
}
