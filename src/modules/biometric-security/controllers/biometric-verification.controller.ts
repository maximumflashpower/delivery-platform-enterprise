import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BiometricVerificationService } from '../services/biometric-verification.service';
import { LogBiometricUsageDto, ApproveUsageDto, DenyUsageDto, CatalogDataDto } from '../dto/biometric-verification.dto';

@ApiTags('Biometric Security - Verification & Auditing')
@Controller('biometric-security')
export class BiometricVerificationController {
  constructor(private readonly service: BiometricVerificationService) {}

  @Get('usage/stats')
  @ApiOperation({ summary: 'Get biometric usage statistics' })
  async getUsageStats(@Body('modelId') modelId?: string) {
    return this.service.getUsageStats(modelId);
  }

  @Post('usage/log')
  @ApiOperation({ summary: 'Log biometric data usage' })
  async logUsage(@Body() dto: LogBiometricUsageDto) {
    return this.service.logUsage(dto);
  }

  @Post('usage/:logId/approve')
  @ApiOperation({ summary: 'Approve pending biometric usage' })
  async approveUsage(@Param('logId') logId: string, @Body() dto: ApproveUsageDto) {
    return this.service.approveUsage(logId, dto.approvedByUserId);
  }

  @Post('usage/:logId/deny')
  @ApiOperation({ summary: 'Deny biometric usage' })
  async denyUsage(@Param('logId') logId: string, @Body() dto: DenyUsageDto) {
    return this.service.denyUsage(logId, dto.reason);
  }

  @Post('catalog')
  @ApiOperation({ summary: 'Catalog biometric data entry' })
  async catalogData(@Body() dto: CatalogDataDto) {
    return this.service.catalogData(dto);
  }

  @Post('catalog/:catalogId/track-access')
  @ApiOperation({ summary: 'Track access to cataloged biometric data' })
  async trackAccess(@Param('catalogId') catalogId: string) {
    return this.service.trackAccess(catalogId);
  }

  @Get('usage/logs')
  @ApiOperation({ summary: 'List all usage logs' })
  async getAllLogs() {
    return this.service.getAllLogs();
  }
}
