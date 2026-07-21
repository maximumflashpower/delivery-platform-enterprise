import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ModerationQueueService } from '../services/moderation-queue.service';
import { ReportContentDto } from '../dto/report-content.dto';
import { UpdateModerationStatusDto } from '../dto/update-moderation-status.dto';

@ApiTags('Trust & Safety - Moderation Queue')
@Controller('trust-safety/moderation')
export class ModerationQueueController {
  constructor(private readonly service: ModerationQueueService) {}

  @Post('report')
  @ApiOperation({ summary: 'Report content for moderation' })
  async report(@Body() dto: ReportContentDto) {
    return this.service.report(dto);
  }

  @Get('queue')
  @ApiOperation({ summary: 'Get moderation queue items' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getQueue(
    @Query('status') status?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.getQueue(status, limit ? parseInt(limit) : 50);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get queue item details' })
  async getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update moderation status' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateModerationStatusDto) {
    return this.service.updateStatus(id, dto);
  }

  @Post(':id/escalate')
  @ApiOperation({ summary: 'Escalate to higher review' })
  async escalate(@Param('id') id: string, @Body() body: { reason: string; moderatorId: string }) {
    return this.service.escalate(id, body.reason, body.moderatorId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get moderation statistics' })
  async getStats() {
    return this.service.getStats();
  }
}
