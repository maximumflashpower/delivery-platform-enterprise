import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FileVersionService } from '../services/file-version.service';
import { CreateFileVersionDto } from '../dto/create-file-version.dto';

@ApiTags('File Storage - Versions')
@Controller('file-storage/versions')
export class FileVersionController {
  constructor(private readonly service: FileVersionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new file version' })
  async create(@Body() dto: CreateFileVersionDto) {
    return this.service.create(dto);
  }

  @Get('file/:fileId')
  @ApiOperation({ summary: 'List versions for a file' })
  @ApiParam({ name: 'fileId' })
  async findByFile(@Param('fileId') fileId: string) {
    return this.service.findByFile(fileId);
  }

  @Get('file/:fileId/current')
  @ApiOperation({ summary: 'Get current version' })
  @ApiParam({ name: 'fileId' })
  async findCurrent(@Param('fileId') fileId: string) {
    return this.service.findCurrent(fileId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get version by ID' })
  @ApiParam({ name: 'id' })
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post('file/:fileId/revert/:versionNumber')
  @ApiOperation({ summary: 'Revert to a specific version' })
  @ApiParam({ name: 'fileId' })
  @ApiParam({ name: 'versionNumber' })
  async revertTo(
    @Param('fileId') fileId: string,
    @Param('versionNumber') versionNumber: number,
    @Query('userId') userId: string,
  ) {
    return this.service.revertTo(fileId, versionNumber, userId);
  }

  @Get('compare/:v1Id/:v2Id')
  @ApiOperation({ summary: 'Compare two versions' })
  @ApiParam({ name: 'v1Id' })
  @ApiParam({ name: 'v2Id' })
  async compare(@Param('v1Id') v1Id: string, @Param('v2Id') v2Id: string) {
    return this.service.compare(v1Id, v2Id);
  }
}
