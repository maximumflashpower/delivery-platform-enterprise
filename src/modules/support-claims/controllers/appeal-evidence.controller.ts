import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppealEvidenceService } from '../services/appeal-evidence.service';
import { CreateAppealEvidenceDto } from '../dto/create-appeal-evidence.dto';

@ApiTags('Support Claims - Appeal Evidence')
@Controller('api/support-claims/appeals/evidence')
export class AppealEvidenceController {
  constructor(private readonly service: AppealEvidenceService) {}

  @Post()
  @ApiOperation({ summary: 'Upload evidence for appeal' })
  async create(@Body() dto: CreateAppealEvidenceDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List evidence for appeal' })
  @ApiQuery({ name: 'appealId', required: true })
  async findByAppeal(@Query('appealId') appealId: string) {
    return this.service.findByAppeal(appealId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get evidence details' })
  async getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Mark evidence as verified' })
  @ApiQuery({ name: 'verifiedBy', required: true })
  async markVerified(@Param('id') id: string, @Query('verifiedBy') verifiedBy: string) {
    return this.service.markVerified(id, verifiedBy);
  }
}
