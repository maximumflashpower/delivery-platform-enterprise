import { ApiTags } from '@nestjs/swagger';
import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { SmartContractService } from '../services/smart-contract.service';
import { SmartContract } from '../entities/smart-contract.entity';

@ApiTags('Blockchain')
@Controller('smart-contracts')
export class SmartContractController {
  constructor(private readonly contractService: SmartContractService) {}

  @PublicRoute()
  @Get()
  findAll(@Query('status') status?: string): Promise<SmartContract[]> {
    return this.contractService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SmartContract | null> {
    return this.contractService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<SmartContract>): Promise<SmartContract> {
    return this.contractService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<SmartContract>): Promise<SmartContract | null> {
    return this.contractService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.contractService.remove(id);
  }
}
