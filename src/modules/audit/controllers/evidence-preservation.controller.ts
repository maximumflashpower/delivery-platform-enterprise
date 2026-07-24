import { Controller, Get, Post, Patch, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EvidencePreservationService } from '../services/evidence-preservation.service';
import { CreateEvidenceDto, SealEvidenceDto, VerifyChainDto, ReleaseEvidenceDto } from '../dto/evidence-preservation.dto';

@ApiTags('Evidence Preservation')
@Controller('audit/evidence-preservations')
export class EvidencePreservationController {
  constructor(private readonly service: EvidencePreservationService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get evidence preservation stats' })
  async getStats() {
    return this.service.getStats();
  }

  @Get()
  @ApiOperation({ summary: 'List all evidence records' })
  async list(
    @Query('status') status?: string,
    @Query('severity') severity?: string,
    @Query('evidenceType') evidenceType?: string,
  ) {
    return this.service.findAll({ status, severity, evidenceType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get evidence by ID' })
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create evidence preservation record' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateEvidenceDto) {
    return this.service.create(dto);
  }

  @Post(':id/collect')
  @ApiOperation({ summary: 'Start evidence collection' })
  async collect(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.startCollection(id);
  }

  @Post(':id/seal')
  @ApiOperation({ summary: 'Seal evidence with hash checksum' })
  async seal(@Param('id', ParseUUIDPipe) id: string, @Body() dto: SealEvidenceDto) {
    return this.service.seal(id, dto);
  }

  @Post(':id/verify-chain')
  @ApiOperation({ summary: 'Verify chain of custody' })
  async verifyChain(@Param('id', ParseUUIDPipe) id: string, @Body() dto: VerifyChainDto) {
    return this.service.verifyChain(id, dto);
  }

  @Post(':id/release')
  @ApiOperation({ summary: 'Release evidence' })
  async release(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ReleaseEvidenceDto) {
    return this.service.release(id, dto);
  }

  @Post(':id/access')
  @ApiOperation({ summary: 'Record access to evidence' })
  async recordAccess(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.recordAccess(id);
  }

  @Patch(':id/schedule-purge')
  @ApiOperation({ summary: 'Schedule evidence purge' })
  async schedulePurge(@Param('id', ParseUUIDPipe) id: string, @Body('purgeDate') purgeDate: string) {
    return this.service.schedulePurge(id, purgeDate);
  }
}
