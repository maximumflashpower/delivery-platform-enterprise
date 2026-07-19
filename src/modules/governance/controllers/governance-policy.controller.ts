import { ApiTags } from '@nestjs/swagger';
import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { GovernancePolicyService } from '../services/governance-policy.service';
import { GovernancePolicy } from '../entities/governance-policy.entity';

@ApiTags('Governance')
@Controller('governance/policies')
export class GovernancePolicyController {
  constructor(private readonly policyService: GovernancePolicyService) {}

  @PublicRoute()
  @PublicRoute()
  @Get()
  findAll(@Query('type') type?: string, @Query('isActive') isActive?: string): Promise<GovernancePolicy[]> {
    return this.policyService.findAll(type, isActive === 'true');
  }

  @PublicRoute()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<GovernancePolicy | null> {
    return this.policyService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<GovernancePolicy>): Promise<GovernancePolicy> {
    return this.policyService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<GovernancePolicy>): Promise<GovernancePolicy | null> {
    return this.policyService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.policyService.remove(id);
  }
}
