import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import {
  Controller, Get, Post, Put, Body, Param, Query, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PayoutService } from '../services/payout.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { PayoutMethod } from '../enums/payout-method.enum';
import { PayoutStatus } from '../enums/payout-status.enum';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';

@ApiTags('payout')
@Controller('payout')
export class PayoutController {
  constructor(private readonly service: PayoutService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create new payout' })
  @ApiResponse({ status: 201, description: 'Payout created successfully' })
  createPayout(@Body() dto: {
    payoutId: string;
    userId?: string;
    amount: number;
    currency: string;
    method: PayoutMethod;
    notes?: string;
  }) {
    return this.service.createPayout(dto);
  }

  @PublicRoute()
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all payouts (optional filter by status)' })
  @ApiResponse({ status: 200, description: 'Return list of payouts' })
  findAllPayouts(@Query('status') status?: PayoutStatus) {
    return this.service.findAllPayouts(status ? { status } : undefined);
  }

  @Get('stats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get payout statistics summary' })
  @ApiResponse({ status: 200, description: 'Return payout stats' })
  getPayoutStats() {
    return this.service.getPayoutStats();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get payout by ID' })
  @ApiResponse({ status: 200, description: 'Return payout details' })
  findPayoutById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findPayoutById(id);
  }

  @Get('ref/:payoutId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get payout by payout reference ID' })
  @ApiResponse({ status: 200, description: 'Return payout details' })
  findPayoutByPayoutId(@Param('payoutId') payoutId: string) {
    return this.service.findPayoutByPayoutId(payoutId);
  }

  @Get('user/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get payouts by user ID' })
  @ApiResponse({ status: 200, description: 'Return user payouts' })
  findPayoutsByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.findPayoutsByUser(userId);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update payout details' })
  @ApiResponse({ status: 200, description: 'Payout updated successfully' })
  updatePayout(@Param('id', ParseUUIDPipe) id: string, @Body() data: Partial<any>) {
    return this.service.updatePayout(id, data);
  }

  @Post(':id/process')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Move payout to processing status' })
  @ApiResponse({ status: 200, description: 'Payout is now processing' })
  processPayout(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.processPayout(id);
  }

  @Post(':id/complete')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mark payout as completed' })
  @ApiResponse({ status: 200, description: 'Payout completed' })
  completePayout(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.completePayout(id);
  }

  @Post(':id/fail')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mark payout as failed' })
  @ApiResponse({ status: 200, description: 'Payout marked as failed' })
  failPayout(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { reason?: string }) {
    return this.service.failPayout(id, dto.reason);
  }

  @Post(':id/cancel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cancel payout' })
  @ApiResponse({ status: 200, description: 'Payout cancelled' })
  cancelPayout(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { reason?: string }) {
    return this.service.cancelPayout(id, dto.reason);
  }
}
