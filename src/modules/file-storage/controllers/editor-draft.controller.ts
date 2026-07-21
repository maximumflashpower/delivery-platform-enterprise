import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EditorDraftService } from '../services/editor-draft.service';
import { CreateFileEditorDraftDto } from '../dto/create-file-editor-draft.dto';
import { FileEditorDraft } from '../entities/file-editor-draft.entity';

@ApiTags('File Storage - Editor Drafts')
@Controller('api/file-storage/editor/drafts')
export class EditorDraftController {
  constructor(private readonly service: EditorDraftService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new editor draft' })
  @ApiResponse({ status: 201, type: FileEditorDraft })
  async create(@Body() dto: CreateFileEditorDraftDto): Promise<FileEditorDraft> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List drafts for a user' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, type: [FileEditorDraft] })
  async findByUser(
    @Query('userId') userId: string,
    @Query('limit') limit?: string,
  ): Promise<FileEditorDraft[]> {
    return this.service.findByUser(userId, limit ? parseInt(limit) : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get draft details' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: FileEditorDraft })
  async findById(@Param('id') id: string): Promise<FileEditorDraft> {
    return this.service.findById(id);
  }

  @Post(':id/save')
  @ApiOperation({ summary: 'Auto-save draft content' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: FileEditorDraft })
  async saveAutoSave(
    @Param('id') id: string,
    @Body() body: { content: string; userId: string },
  ): Promise<FileEditorDraft> {
    return this.service.saveAutoSave(id, body.content, body.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update draft' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: FileEditorDraft })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<FileEditorDraft>,
    @Query('userId') userId: string,
  ): Promise<FileEditorDraft> {
    return this.service.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete draft' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string, @Query('userId') userId: string): Promise<void> {
    return this.service.delete(id, userId);
  }

  @Post(':id/convert')
  @ApiOperation({ summary: 'Convert draft to different format' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  async convertFormat(
    @Param('id') id: string,
    @Body() body: { targetFormat: string },
  ): Promise<{ convertedContent: string }> {
    return this.service.convertFormat(id, body.targetFormat);
  }
}
