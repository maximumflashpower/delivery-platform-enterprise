import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from '../entities/achievement.entity';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepo: Repository<Achievement>,
  ) {}

  async findAll(isVisible?: boolean): Promise<Achievement[]> {
    return this.achievementRepo.find({ where: isVisible !== undefined ? { isVisible } as any : {} });
  }

  async findOne(id: string): Promise<Achievement | null> {
    return this.achievementRepo.findOneBy({ id });
  }

  async create(data: Partial<Achievement>): Promise<Achievement> {
    const entity = this.achievementRepo.create(data);
    return this.achievementRepo.save(entity);
  }

  async update(id: string, data: Partial<Achievement>): Promise<Achievement | null> {
    await this.achievementRepo.update(id, data);
    return this.achievementRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.achievementRepo.delete(id);
  }
}
