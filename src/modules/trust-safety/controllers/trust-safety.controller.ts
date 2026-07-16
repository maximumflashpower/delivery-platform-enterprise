import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TrustSafetyService } from '../services/trust-safety.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { VerificationLevel } from '../enums/verification-level.enum';
import { IncidentSeverity } from '../enums/incident-severity.enum';

@ApiTags('trust-safety')
@Controller('trust-safety')
export class TrustSafetyController {
  constructor(private readonly service: TrustSafetyService) {}

  @Post('badges')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Award verification badge to user' })
  awardBadge(@Body() dto: { userId: string; badgeType: string; level: VerificationLevel; awardedReason?: string; expiresAt?: Date }) {
    return this.service.awardBadge(dto.userId, dto);
  }

  @Get('badges/:userId')
  @ApiOperation({ summary: 'Get user badges' })
  getUserBadges(@Param('userId') userId: string) {
    return this.service.getUserBadges(userId);
  }

  @Delete('badges/:badgeId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Revoke verification badge' })
  revokeBadge(@Param('badgeId') badgeId: string) {
    return this.service.revokeBadge(badgeId);
  }

  @Get('scores/:userId')
  @ApiOperation({ summary: 'Get current trust score for user' })
  getScore(@Param('userId') userId: string) {
    return this.service.getOrCreateScore(userId);
  }

  @Get('scores/:userId/history')
  @ApiOperation({ summary: 'Get trust score history' })
  getScoreHistory(@Param('userId') userId: string, @Query('limit') limit?: string) {
    return this.service.getUserScoreHistory(userId, limit ? parseInt(limit) : 10);
  }

  @Put('scores/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update trust score' })
  updateScore(@Param('userId') userId: string, @Body() dto: { score: number; factors?: Record<string, number> }) {
    return this.service.updateScore(userId, dto.score, dto.factors);
  }

  @Post('incidents')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Report new incident' })
  createIncident(@Body() dto: { reportedUserId?: string; reporterId?: string; category: string; severity: IncidentSeverity; description: string }) {
    return this.service.createIncident(dto);
  }

  @Get('incidents')
  @ApiOperation({ summary: 'List incidents, optionally filtered by status' })
  findAllIncidents(@Query('status') status?: string) {
    return this.service.findAllIncidents(status);
  }

  @Get('incidents/:id')
  @ApiOperation({ summary: 'Get incident by ID' })
  findIncidentById(@Param('id') id: string) {
    return this.service.findIncidentById(id);
  }

  @Get('incidents/user/:userId')
  @ApiOperation({ summary: 'Get incidents by user (reported or reporter)' })
  findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }

  @Put('incidents/:id/resolve')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Resolve incident' })
  resolveIncident(@Param('id') id: string, @Body() dto: { resolutionNotes: string }) {
    return this.service.resolveIncident(id, dto.resolutionNotes);
  }

  @Put('incidents/:id/escalate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Escalate incident severity' })
  escalateIncident(@Param('id') id: string, @Body() dto: { severity: IncidentSeverity }) {
    return this.service.escalateIncident(id, dto.severity);
  }
}
