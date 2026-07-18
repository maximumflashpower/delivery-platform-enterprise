import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { LanguageService } from '../services/language.service';
import { Language } from '../entities/language.entity';

@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @PublicRoute()
  @Get()
  findAll(@Query('isActive') isActive?: string): Promise<Language[]> {
    return this.languageService.findAll(isActive === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Language | null> {
    return this.languageService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Language>): Promise<Language> {
    return this.languageService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Language>): Promise<Language | null> {
    return this.languageService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.languageService.remove(id);
  }
}
