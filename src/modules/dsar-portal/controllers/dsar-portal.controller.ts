import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DsarPortalService } from '../services/dsar-portal.service';
import {
  CreateDsarRequestDto,
  UpdateDsarStatusDto,
  CreateDeletionScopeDto,
  UpdateDeletionScopeDto,
  ExecuteDeletionDto,
  CreateExportJobDto,
  DsarQueryDto,
} from '../dto/dsar-portal.dto';

@ApiTags('DSAR Portal')
@ApiBearerAuth()
@Controller('dsar-portal')
export class DsarPortalController {
  constructor(private readonly service: DsarPortalService) {}

  // ════════════════════════════════════════════
  // DSAR REQUESTS
  // ════════════════════════════════════════════

  @Post('requests')
  @ApiOperation({ summary: 'Create a DSAR request (GDPR Art. 15-21)' })
  @ApiResponse({ status: 201, description: 'DSAR request created' })
  async createRequest(@Body() dto: CreateDsarRequestDto) {
    return this.service.createRequest(dto);
  }

  @Get('requests')
  @ApiOperation({ summary: 'List all DSAR requests' })
  @ApiResponse({ status: 200, description: 'List of DSAR requests' })
  async listRequests(@Query() query: DsarQueryDto) {
    return this.service.findAllRequests(query);
  }

  @Get('requests/:id')
  @ApiOperation({ summary: 'Get a specific DSAR request' })
  @ApiResponse({ status: 200, description: 'DSAR request details' })
  async getRequest(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findRequestById(id);
  }

  @Patch('requests/:id/status')
  @ApiOperation({ summary: 'Update DSAR request status' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDsarStatusDto,
  ) {
    return this.service.updateRequestStatus(id, dto);
  }

  @Get('requests/user/:userId')
  @ApiOperation({ summary: 'Get DSAR requests for a user' })
  @ApiResponse({ status: 200, description: 'User DSAR requests' })
  async getUserRequests(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.findRequestsByUser(userId);
  }

  // ════════════════════════════════════════════
  // DELETION SCOPES
  // ════════════════════════════════════════════

  @Post('deletion-scopes')
  @ApiOperation({ summary: 'Create a selective deletion scope' })
  @ApiResponse({ status: 201, description: 'Deletion scope created' })
  async createDeletionScope(@Body() dto: CreateDeletionScopeDto) {
    return this.service.createDeletionScope(dto);
  }

  @Get('deletion-scopes/:requestId')
  @ApiOperation({ summary: 'Get deletion scopes for a request' })
  @ApiResponse({ status: 200, description: 'List of deletion scopes' })
  async getDeletionScopes(@Param('requestId', ParseUUIDPipe) requestId: string) {
    return this.service.findDeletionScopesByRequest(requestId);
  }

  @Patch('deletion-scopes/:id')
  @ApiOperation({ summary: 'Update a deletion scope' })
  @ApiResponse({ status: 200, description: 'Deletion scope updated' })
  async updateDeletionScope(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDeletionScopeDto,
  ) {
    return this.service.updateDeletionScope(id, dto);
  }

  @Delete('deletion-scopes/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a deletion scope' })
  @ApiResponse({ status: 204, description: 'Deletion scope removed' })
  async deleteDeletionScope(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.deleteDeletionScope(id);
  }

  @Post('deletion-scopes/:id/execute')
  @ApiOperation({ summary: 'Execute selective deletion for a scope' })
  @ApiResponse({ status: 200, description: 'Deletion executed' })
  async executeDeletion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ExecuteDeletionDto,
  ) {
    return this.service.executeDeletion(id, dto);
  }

  // ════════════════════════════════════════════
  // EXPORT JOBS
  // ════════════════════════════════════════════

  @Post('export-jobs')
  @ApiOperation({ summary: 'Create a data export job' })
  @ApiResponse({ status: 201, description: 'Export job created' })
  async createExportJob(@Body() dto: CreateExportJobDto) {
    return this.service.createExportJob(dto);
  }

  @Get('export-jobs/:id')
  @ApiOperation({ summary: 'Get export job status' })
  @ApiResponse({ status: 200, description: 'Export job details' })
  async getExportJob(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findExportJobById(id);
  }

  @Get('export-jobs/request/:requestId')
  @ApiOperation({ summary: 'Get export jobs for a request' })
  @ApiResponse({ status: 200, description: 'List of export jobs' })
  async getExportJobsByRequest(@Param('requestId', ParseUUIDPipe) requestId: string) {
    return this.service.findExportJobsByRequest(requestId);
  }

  @Post('export-jobs/:id/generate')
  @ApiOperation({ summary: 'Trigger export generation' })
  @ApiResponse({ status: 200, description: 'Export generation triggered' })
  async generateExport(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.generateExport(id);
  }

  @Get('export-jobs/:id/download')
  @ApiOperation({ summary: 'Download exported data' })
  @ApiResponse({ status: 200, description: 'Download URL' })
  async downloadExport(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.downloadExport(id);
  }

  // ════════════════════════════════════════════
  // STATS
  // ════════════════════════════════════════════

  @Get('stats')
  @ApiOperation({ summary: 'Get DSAR portal statistics' })
  @ApiResponse({ status: 200, description: 'Portal stats' })
  async getStats() {
    return this.service.getStats();
  }
}
