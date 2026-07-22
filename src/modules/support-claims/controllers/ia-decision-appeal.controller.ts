import { Controller, Get, Post, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IaDecisionAppealService } from '../services/ia-decision-appeal.service';
import { CreateIaDecisionAppealDto, HumanReviewDto, EscalateToBoardDto } from '../dto/ia-decision-appeal.dto';

@ApiTags('Support Claims - IA Decision Appeals')
@Controller('support-claims/ia-appeals')
export class IaDecisionAppealController {
  constructor(private readonly service: IaDecisionAppealService) {}

  @Get()
  @ApiOperation({ summary: 'List all IA decision appeals' })
  async findAll(@Query('status') status?: string) {
    const items = await this.service.findAll();
    if (status) return items.filter(i => i.reviewStatus === status);
    return items;
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get IA decision appeal statistics' })
  async getStats() {
    return this.service.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get IA decision appeal details' })
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('by-appeal/:appealId')
  @ApiOperation({ summary: 'Find IA appeals by appeal ID' })
  async findByAppeal(@Param('appealId') appealId: string) {
    return this.service.findByAppeal(appealId);
  }

  @Get('by-decision/:decisionId')
  @ApiOperation({ summary: 'Find appeals by IA decision ID' })
  async findByDecision(@Param('decisionId') decisionId: string) {
    return this.service.findByDecision(decisionId);
  }

  @Post()
  @ApiOperation({ summary: 'Create IA decision appeal' })
  async create(@Body() dto: CreateIaDecisionAppealDto) {
    return this.service.create(dto);
  }

  @Post(':id/start-review')
  @ApiOperation({ summary: 'Start human review of IA decision appeal' })
  async startReview(@Param('id') id: string, @Body() dto: HumanReviewDto) {
    return this.service.startHumanReview(id, dto);
  }

  @Post(':id/complete-review')
  @ApiOperation({ summary: 'Complete human review and render decision' })
  async completeReview(@Param('id') id: string, @Body() dto: HumanReviewDto) {
    return this.service.completeReview(id, dto);
  }

  @Post(':id/escalate')
  @ApiOperation({ summary: 'Escalate IA decision appeal to board review' })
  async escalate(@Param('id') id: string, @Body() dto: EscalateToBoardDto) {
    return this.service.escalate(id, dto);
  }
}
