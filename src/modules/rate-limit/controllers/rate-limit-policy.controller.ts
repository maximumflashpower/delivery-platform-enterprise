import { ApiTags } from '@nestjs/swagger';
import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { RateLimitPolicyService } from '../services/rate-limit-policy.service';
import { RateLimitPolicy } from '../entities/rate-limit-policy.entity';

@ApiTags('Rate Limiting')
@Controller('rate-limit/policies')
export class RateLimitPolicyController {
  constructor(private readonly policyService: RateLimitPolicyService) {}

  @PublicRoute()
  @Get()
  findAll(@Query('isActive') isActive?: string): Promise<RateLimitPolicy[]> {
    return this.policyService.findAll(isActive === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<RateLimitPolicy | null> {
    return this.policyService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<RateLimitPolicy>): Promise<RateLimitPolicy> {
    return this.policyService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<RateLimitPolicy>): Promise<RateLimitPolicy | null> {
    return this.policyService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.policyService.remove(id);
  }
}
