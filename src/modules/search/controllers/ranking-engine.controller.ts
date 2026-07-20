import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RankingEngineService, RankInput } from '../services/ranking-engine.service';
import { RankingModel, RankingStrategy, ModelStatus } from '../entities/ranking-model.entity';
import { RankingResult } from '../entities/ranking-result.entity';

@ApiTags('ranking-engine')
@Controller('search/ranking')
export class RankingEngineController {
  constructor(private readonly service: RankingEngineService) {}

  @Post('models')
  @ApiOperation({ summary: 'Create a ranking model' })
  @ApiResponse({ status: 201, type: RankingModel })
  createModel(@Body() data: Partial<RankingModel>): Promise<RankingModel> {
    return this.service.createModel(data);
  }

  @Get('models')
  @ApiOperation({ summary: 'List all ranking models' })
  @ApiResponse({ status: 200, type: [RankingModel] })
  findAllModels(): Promise<RankingModel[]> {
    return this.service.findAllModels();
  }

  @Get('models/:id')
  @ApiOperation({ summary: 'Get a ranking model' })
  @ApiResponse({ status: 200, type: RankingModel })
  findOneModel(@Param('id', ParseUUIDPipe) id: string): Promise<RankingModel> {
    return this.service.findOneModel(id);
  }

  @Patch('models/:id')
  @ApiOperation({ summary: 'Update a ranking model' })
  @ApiResponse({ status: 200, type: RankingModel })
  updateModel(@Param('id', ParseUUIDPipe) id: string, @Body() updates: Partial<RankingModel>): Promise<RankingModel> {
    return this.service.updateModel(id, updates);
  }

  @Post('models/:id/activate')
  @ApiOperation({ summary: 'Activate a ranking model' })
  @ApiResponse({ status: 200, type: RankingModel })
  activateModel(@Param('id', ParseUUIDPipe) id: string): Promise<RankingModel> {
    return this.service.activateModel(id);
  }

  @Post('rank')
  @ApiOperation({ summary: 'Rank entities for a user using hybrid model' })
  @ApiResponse({ status: 200, type: [RankingResult] })
  rank(@Body() input: RankInput): Promise<RankingResult[]> {
    return this.service.rank(input);
  }

  @Get('history/:userId')
  @ApiOperation({ summary: 'Get ranking history for a user' })
  @ApiResponse({ status: 200, type: [RankingResult] })
  getHistory(@Param('userId') userId: string, @Query('limit') limit?: number): Promise<RankingResult[]> {
    return this.service.getRankingHistory(userId, limit ? parseInt(String(limit)) : 50);
  }

  @Get('top/:userId')
  @ApiOperation({ summary: 'Get top ranked entities for a user' })
  @ApiResponse({ status: 200, type: [RankingResult] })
  getTopRanked(@Param('userId') userId: string, @Query('limit') limit?: number): Promise<RankingResult[]> {
    return this.service.getTopRanked(userId, limit ? parseInt(String(limit)) : 10);
  }
}
