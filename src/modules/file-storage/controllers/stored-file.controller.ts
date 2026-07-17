import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { StoredFileService } from '../services/stored-file.service';
import { StoredFile } from '../entities/stored-file.entity';

@Controller('files')
export class StoredFileController {
  constructor(private readonly fileService: StoredFileService) {}

  @Get()
  findAll(@Query('bucketId') bucketId?: string): Promise<StoredFile[]> {
    return this.fileService.findAll(bucketId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<StoredFile | null> {
    return this.fileService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<StoredFile>): Promise<StoredFile> {
    return this.fileService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<StoredFile>): Promise<StoredFile | null> {
    return this.fileService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.fileService.remove(id);
  }
}
