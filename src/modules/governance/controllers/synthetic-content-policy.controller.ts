import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SyntheticContentPolicyService } from '../services/synthetic-content-policy.service';
import { CreatePolicyDto, EvaluateContentDto } from '../dto/synthetic-content-policy.dto';

@ApiTags('Governance - Synthetic Content Policies')
@Controller('governance/synthetic-content/policies')
export class SyntheticContentPolicyController {
  constructor(private readonly service: SyntheticContentPolicyService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get synthetic content policy statistics' })
  async getStats() {
    return this.service.getStats();
  }

  @Get('active')
  @ApiOperation({ summary: 'List all active policies' })
  async findActive() {
    return this.service.findActive();
  }

  @Get()
  @ApiOperation({ summary: 'List all policies, optionally filtered by status' })
  async findAll(@Query('status') status?: string) {
    return this.service.findAll(status);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new synthetic content policy' })
  async create(@Body() dto: CreatePolicyDto) {
    return this.service.create(dto);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate a policy' })
  async activate(@Param('id') id: string) {
    return this.service.activate(id);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a policy' })
  async deactivate(@Param('id') id: string) {
    return this.service.deactivate(id);
  }

  @Post('evaluate')
  @ApiOperation({ summary: 'Evaluate content against active policies' })
  async evaluateContent(@Body() dto: EvaluateContentDto) {
    return this.service.evaluateContent(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get policy details by ID' })
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }
}
