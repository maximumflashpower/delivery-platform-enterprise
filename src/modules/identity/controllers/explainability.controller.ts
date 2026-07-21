import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ExplainabilityService } from '../services/explainability.service';
import { CreateExplainabilityDto } from '../dto/create-explainability.dto';
import { ExplainabilityRecord } from '../entities/explainability-record.entity';

@ApiTags('Identity - Explainability')
@Controller('api/identity/explainability')
export class ExplainabilityController {
  constructor(private readonly service: ExplainabilityService) {}

  @Post()
  @ApiOperation({ summary: 'Create an explainability record' })
  @ApiResponse({ status: 201, type: ExplainabilityRecord })
  async create(@Body() dto: CreateExplainabilityDto): Promise<ExplainabilityRecord> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List explainability records for a user' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, type: [ExplainabilityRecord] })
  async findByUser(
    @Query('userId') userId: string,
    @Query('limit') limit?: string,
  ): Promise<ExplainabilityRecord[]> {
    return this.service.findByUser(userId, limit ? parseInt(limit) : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get explainability record details' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: ExplainabilityRecord })
  async findById(@Param('id') id: string): Promise<ExplainabilityRecord> {
    return this.service.findById(id);
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Review an explainability record' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: ExplainabilityRecord })
  async review(
    @Param('id') id: string,
    @Body() body: { reviewedBy: string; notes?: string },
  ): Promise<ExplainabilityRecord> {
    return this.service.review(id, body.reviewedBy, body.notes);
  }

  @Post(':id/dispute')
  @ApiOperation({ summary: 'Dispute an explainability record' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: ExplainabilityRecord })
  async dispute(
    @Param('id') id: string,
    @Body() body: { feedback: string },
  ): Promise<ExplainabilityRecord> {
    return this.service.dispute(id, body.feedback);
  }

  @Post(':id/rate')
  @ApiOperation({ summary: 'Rate an explainability record (0-5)' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: ExplainabilityRecord })
  async rate(
    @Param('id') id: string,
    @Body() body: { rating: number },
  ): Promise<ExplainabilityRecord> {
    return this.service.rate(id, body.rating);
  }

  @Get('decision/:type')
  @ApiOperation({ summary: 'Get records by decision type' })
  @ApiParam({ name: 'type' })
  @ApiResponse({ status: 200, type: [ExplainabilityRecord] })
  async getByDecisionType(@Param('type') type: string): Promise<ExplainabilityRecord[]> {
    return this.service.getByDecisionType(type);
  }
}
