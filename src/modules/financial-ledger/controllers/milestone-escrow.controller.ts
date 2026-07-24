import { Controller, Get, Post, Patch, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MilestoneEscrowService } from '../services/milestone-escrow.service';
import { CreateEscrowDto, FundEscrowDto, SubmitMilestoneDto, ApproveMilestoneDto, RejectMilestoneDto, RaiseDisputeDto, ResolveDisputeDto } from '../dto/milestone-escrow.dto';

@ApiTags('Milestone Escrow')
@Controller('financial/milestone-escrows')
export class MilestoneEscrowController {
  constructor(private readonly service: MilestoneEscrowService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get escrow stats' })
  async getStats() {
    return this.service.getStats();
  }

  @Get()
  @ApiOperation({ summary: 'List all escrows' })
  async list(
    @Query('status') status?: string,
    @Query('sponsorId') sponsorId?: string,
    @Query('recipientId') recipientId?: string,
  ) {
    return this.service.findAll({ status, sponsorId, recipientId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get escrow by ID' })
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create milestone escrow' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateEscrowDto) {
    return this.service.create(dto);
  }

  @Post(':id/fund')
  @ApiOperation({ summary: 'Fund the escrow' })
  async fund(@Param('id', ParseUUIDPipe) id: string, @Body() dto: FundEscrowDto) {
    return this.service.fund(id, dto);
  }

  @Post(':id/milestones/submit')
  @ApiOperation({ summary: 'Submit milestone for review' })
  async submitMilestone(@Param('id', ParseUUIDPipe) id: string, @Body() dto: SubmitMilestoneDto) {
    return this.service.submitMilestone(id, dto);
  }

  @Post(':id/milestones/approve')
  @ApiOperation({ summary: 'Approve milestone and release funds' })
  async approveMilestone(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ApproveMilestoneDto) {
    return this.service.approveMilestone(id, dto);
  }

  @Post(':id/milestones/reject')
  @ApiOperation({ summary: 'Reject milestone' })
  async rejectMilestone(@Param('id', ParseUUIDPipe) id: string, @Body() dto: RejectMilestoneDto) {
    return this.service.rejectMilestone(id, dto);
  }

  @Post(':id/dispute')
  @ApiOperation({ summary: 'Raise dispute' })
  async raiseDispute(@Param('id', ParseUUIDPipe) id: string, @Body() dto: RaiseDisputeDto) {
    return this.service.raiseDispute(id, dto);
  }

  @Post(':id/dispute/resolve')
  @ApiOperation({ summary: 'Resolve dispute' })
  async resolveDispute(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ResolveDisputeDto) {
    return this.service.resolveDispute(id, dto);
  }

  @Patch(':id/refund-partial')
  @ApiOperation({ summary: 'Refund partial amount' })
  async refundPartial(@Param('id', ParseUUIDPipe) id: string, @Body('amount') amount: number) {
    return this.service.refundPartial(id, amount);
  }
}
