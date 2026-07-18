import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { AchievementService } from '../services/achievement.service';
import { Achievement } from '../entities/achievement.entity';

@Controller('gamification/achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @PublicRoute()
  @Get()
  findAll(@Query('isVisible') isVisible?: string): Promise<Achievement[]> {
    return this.achievementService.findAll(isVisible === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Achievement | null> {
    return this.achievementService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Achievement>): Promise<Achievement> {
    return this.achievementService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Achievement>): Promise<Achievement | null> {
    return this.achievementService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.achievementService.remove(id);
  }
}
