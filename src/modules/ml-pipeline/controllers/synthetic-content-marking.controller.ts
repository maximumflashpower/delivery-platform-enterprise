import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SyntheticContentMarkingService } from '../services/synthetic-content-marking.service';
import { ApplyWatermarkDto, DetectWatermarkDto } from '../dto/synthetic-content-marking.dto';

@ApiTags('ML Pipeline - Synthetic Content Marking')
@Controller('ml-pipeline/synthetic-content')
export class SyntheticContentMarkingController {
  constructor(private readonly service: SyntheticContentMarkingService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get synthetic content marking statistics' })
  async getStats() {
    return this.service.getStats();
  }

  @Get('content/:contentId')
  @ApiOperation({ summary: 'Find watermarks by content ID' })
  async findByContent(@Param('contentId') contentId: string) {
    return this.service.findByContent(contentId);
  }

  @Get()
  @ApiOperation({ summary: 'List all markings, optionally filtered by status' })
  async findAll(@Query('status') status?: string) {
    return this.service.findAll(status);
  }

  @Post('apply')
  @ApiOperation({ summary: 'Apply watermark to synthetic content' })
  async applyWatermark(@Body() dto: ApplyWatermarkDto) {
    return this.service.applyWatermark(dto);
  }

  @Post('detect')
  @ApiOperation({ summary: 'Detect watermark in content sample' })
  async detectWatermark(@Body() dto: DetectWatermarkDto) {
    return this.service.detectWatermark(dto);
  }

  @Post(':id/flag')
  @ApiOperation({ summary: 'Flag suspicious marked content' })
  async flagSuspiciousContent(@Param('id') id: string) {
    return this.service.flagSuspiciousContent(id);
  }

  @Post(':id/remove')
  @ApiOperation({ summary: 'Remove marking from content' })
  async removeMarking(@Param('id') id: string) {
    return this.service.removeMarking(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get watermark details by ID' })
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }
}
