import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { WellnessGoalService } from '../services/wellness-goal.service';
import { WellnessGoal } from '../entities/wellness-goal.entity';

@Controller('wellness/goals')
export class WellnessGoalController {
  constructor(private readonly goalService: WellnessGoalService) {}

  @Get()
  findAll(@Query('userId') userId?: string): Promise<WellnessGoal[]> {
    return this.goalService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<WellnessGoal | null> {
    return this.goalService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<WellnessGoal>): Promise<WellnessGoal> {
    return this.goalService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<WellnessGoal>): Promise<WellnessGoal | null> {
    return this.goalService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.goalService.remove(id);
  }
}
