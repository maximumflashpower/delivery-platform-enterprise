import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { BiometricTemplateService } from '../services/biometric-template.service';
import { BiometricTemplate } from '../entities/biometric-template.entity';

@Controller('biometric/templates')
export class BiometricTemplateController {
  constructor(private readonly templateService: BiometricTemplateService) {}

  @PublicRoute()
  @Get()
  findAll(@Query('userId') userId?: string): Promise<BiometricTemplate[]> {
    return this.templateService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BiometricTemplate | null> {
    return this.templateService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<BiometricTemplate>): Promise<BiometricTemplate> {
    return this.templateService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<BiometricTemplate>): Promise<BiometricTemplate | null> {
    return this.templateService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.templateService.remove(id);
  }
}
