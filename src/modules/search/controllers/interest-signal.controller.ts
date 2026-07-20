import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InterestSignalService } from '../services/interest-signal.service';
import { InterestSignal, SignalType, SignalSource } from '../entities/interest-signal.entity';

@ApiTags('interest-signals')
@Controller('search/interest-signals')
export class InterestSignalController {
  constructor(private readonly service: InterestSignalService) {}

  @Post('record')
  @ApiOperation({ summary: 'Record an interest signal' })
  @ApiResponse({ status: 201, type: InterestSignal })
  record(
    @Body('userId') userId: string,
    @Body('entityId') entityId: string,
    @Body('entityType') entityType: string,
    @Body('signalType') signalType: SignalType,
    @Body('source') source?: SignalSource,
    @Body('weight') weight?: number,
    @Body('context') context?: string,
    @Body('dwellTime') dwellTime?: number,
    @Body('ratingValue') ratingValue?: string,
    @Body('searchText') searchText?: string
  ): Promise<InterestSignal> {
    return this.service.record(userId, entityId, entityType, signalType, source, weight, context, dwellTime, ratingValue, searchText);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get signals for a user' })
  @ApiResponse({ status: 200, type: [InterestSignal] })
  findByUser(@Param('userId') userId: string, @Query('limit') limit?: number): Promise<InterestSignal[]> {
    return this.service.findByUser(userId, limit ? parseInt(String(limit)) : 100);
  }

  @Get('entity/:entityId')
  @ApiOperation({ summary: 'Get signals for an entity' })
  @ApiResponse({ status: 200, type: [InterestSignal] })
  findByEntity(@Param('entityId') entityId: string, @Query('limit') limit?: number): Promise<InterestSignal[]> {
    return this.service.findByEntity(entityId, limit ? parseInt(String(limit)) : 50);
  }

  @Get('profile/:userId')
  @ApiOperation({ summary: 'Get user signal profile' })
  @ApiResponse({ status: 200 })
  getProfile(@Param('userId') userId: string): Promise<Record<string, number>> {
    return this.service.getUserSignalProfile(userId);
  }
}
