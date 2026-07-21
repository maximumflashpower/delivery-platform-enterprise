import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AppealService } from '../services/appeal.service';
import { CreateAppealDto } from '../dto/create-appeal.dto';
import { UpdateAppealStatusDto } from '../dto/update-appeal-status.dto';

@ApiTags('Support Claims - Appeals')
@Controller('api/support-claims/appeals')
export class AppealController {
  constructor(private readonly service: AppealService) {}

  @Post()
  @ApiOperation({ summary: 'Submit an appeal' })
  async create(@Body() dto: CreateAppealDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List appeals' })
  @ApiQuery({ name: 'claimId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  async list(
    @Query('claimId') claimId?: string,
    @Query('userId') userId?: string,
  ) {
    if (claimId) return this.service.findByClaim(claimId);
    if (userId) return this.service.findByUser(userId);
    return [];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appeal details' })
  async getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update appeal status' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateAppealStatusDto) {
    return this.service.updateStatus(id, dto);
  }

  @Post(':id/withdraw')
  @ApiOperation({ summary: 'Withdraw appeal' })
  @ApiQuery({ name: 'userId', required: true })
  async withdraw(@Param('id') id: string, @Query('userId') userId: string) {
    return this.service.withdraw(id, userId);
  }
}
