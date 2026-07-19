import { ApiTags } from '@nestjs/swagger';
import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { CarbonCreditService } from '../services/carbon-credit.service';
import { CarbonCredit } from '../entities/carbon-credit.entity';

@ApiTags('Sustainability')
@Controller('carbon/credits')
export class CarbonCreditController {
  constructor(private readonly creditService: CarbonCreditService) {}

  @PublicRoute()
  @Get()
  findAll(@Query('isActive') isActive?: string): Promise<CarbonCredit[]> {
    return this.creditService.findAll(isActive === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CarbonCredit | null> {
    return this.creditService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<CarbonCredit>): Promise<CarbonCredit> {
    return this.creditService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<CarbonCredit>): Promise<CarbonCredit | null> {
    return this.creditService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.creditService.remove(id);
  }
}
