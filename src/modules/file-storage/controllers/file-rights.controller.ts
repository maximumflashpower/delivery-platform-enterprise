import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FileRightsService } from '../services/file-rights.service';
import { CreateFileRightsDto } from '../dto/create-file-rights.dto';

@ApiTags('File Storage - Rights')
@Controller('api/file-storage/rights')
export class FileRightsController {
  constructor(private readonly service: FileRightsService) {}

  @Post()
  @ApiOperation({ summary: 'Create rights record for a file' })
  async create(@Body() dto: CreateFileRightsDto) {
    return this.service.create(dto);
  }

  @Get('file/:fileId')
  @ApiOperation({ summary: 'Get rights for a file' })
  async findByFile(@Param('fileId') fileId: string) {
    return this.service.findByFile(fileId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rights by ID' })
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update rights' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateFileRightsDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete rights record' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
