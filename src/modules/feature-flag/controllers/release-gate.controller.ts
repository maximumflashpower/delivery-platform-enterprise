import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReleaseGateService } from '../services/release-gate.service';
import { ReleaseGate } from '../entities/release-gate.entity';

@ApiTags('release-gates')
@Controller('feature-flag/release-gates')
export class ReleaseGateController {
  constructor(private readonly releaseGateService: ReleaseGateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new release gate' })
  @ApiResponse({ status: 201, description: 'Gate created successfully', type: ReleaseGate })
  create(@Body() gateData: Partial<ReleaseGate>): Promise<ReleaseGate> {
    return this.releaseGateService.create(gateData);
  }

  @Get()
  @ApiOperation({ summary: 'List all release gates' })
  @ApiResponse({ status: 200, description: 'Return all gates', type: [ReleaseGate] })
  findAll(): Promise<ReleaseGate[]> {
    return this.releaseGateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific release gate' })
  @ApiResponse({ status: 200, description: 'Return the gate', type: ReleaseGate })
  @ApiResponse({ status: 404, description: 'Gate not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ReleaseGate> {
    return this.releaseGateService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a release gate' })
  @ApiResponse({ status: 200, description: 'Gate updated', type: ReleaseGate })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updates: Partial<ReleaseGate>): Promise<ReleaseGate> {
    return this.releaseGateService.update(id, updates);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a release gate' })
  @ApiResponse({ status: 204, description: 'Gate deleted successfully' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.releaseGateService.remove(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve a release gate' })
  @ApiResponse({ status: 200, description: 'Gate approved', type: ReleaseGate })
  @ApiResponse({ status: 403, description: 'Cannot approve gate in current status' })
  approve(@Param('id', ParseUUIDPipe) id: string, @Body('approverId') approverId: string): Promise<ReleaseGate> {
    return this.releaseGateService.approve(id, approverId);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject a release gate' })
  @ApiResponse({ status: 200, description: 'Gate rejected', type: ReleaseGate })
  reject(@Param('id', ParseUUIDPipe) id: string, @Body() body: { rejectorId: string; reason?: string }): Promise<ReleaseGate> {
    return this.releaseGateService.reject(id, body.rejectorId, body.reason);
  }

  @Post(':id/rollback')
  @ApiOperation({ summary: 'Rollback a release gate' })
  @ApiResponse({ status: 200, description: 'Gate rolled back', type: ReleaseGate })
  rollback(@Param('id', ParseUUIDPipe) id: string, @Body('rollbackBy') rollbackBy: string): Promise<ReleaseGate> {
    return this.releaseGateService.rollback(id, rollbackBy);
  }
}
