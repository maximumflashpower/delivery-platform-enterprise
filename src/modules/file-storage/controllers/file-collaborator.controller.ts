import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FileCollaboratorService } from '../services/file-collaborator.service';
import { CreateFileCollaboratorDto } from '../dto/create-file-collaborator.dto';

@ApiTags('File Storage - Collaborators')
@Controller('api/file-storage/collaborators')
export class FileCollaboratorController {
  constructor(private readonly service: FileCollaboratorService) {}

  @Post()
  @ApiOperation({ summary: 'Add a collaborator' })
  async add(@Body() dto: CreateFileCollaboratorDto) {
    return this.service.add(dto);
  }

  @Get('file/:fileId')
  @ApiOperation({ summary: 'List collaborators for a file' })
  async findByFile(@Param('fileId') fileId: string) {
    return this.service.findByFile(fileId);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Update collaborator role' })
  async updateRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.service.updateRole(id, body.role);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept invitation' })
  async accept(@Param('id') id: string) {
    return this.service.accept(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove collaborator' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('file/:fileId/permissions/:userId')
  @ApiOperation({ summary: 'Get permissions for user on file' })
  async getPermissions(@Param('fileId') fileId: string, @Param('userId') userId: string) {
    return { role: await this.service.getPermissions(fileId, userId) };
  }
}
