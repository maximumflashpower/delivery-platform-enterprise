import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEditorDraft } from '../entities/file-editor-draft.entity';
import { CreateFileEditorDraftDto } from '../dto/create-file-editor-draft.dto';

@Injectable()
export class EditorDraftService {
  constructor(
    @InjectRepository(FileEditorDraft)
    private readonly draftRepo: Repository<FileEditorDraft>,
  ) {}

  async create(dto: CreateFileEditorDraftDto): Promise<FileEditorDraft> {
    const draft = new FileEditorDraft();
    Object.assign(draft, dto);
    draft.version = 1;
    draft.autoSaveAt = new Date();
    return this.draftRepo.save(draft);
  }

  async saveAutoSave(draftId: string, content: string, userId: string): Promise<FileEditorDraft> {
    const draft = await this.findById(draftId);
    
    if (draft.userId !== userId) {
      throw new BadRequestException('Unauthorized to modify this draft');
    }

    draft.content = content;
    draft.version += 1;
    draft.autoSaveAt = new Date();
    draft.updatedAt = new Date();
    return this.draftRepo.save(draft);
  }

  async findById(id: string): Promise<FileEditorDraft> {
    const draft = await this.draftRepo.findOne({ where: { id } });
    if (!draft) throw new NotFoundException(`Draft ${id} not found`);
    return draft;
  }

  async findByUser(userId: string, limit?: number): Promise<FileEditorDraft[]> {
    const query = this.draftRepo.createQueryBuilder('draft')
      .where('draft.userId = :userId', { userId })
      .orderBy('draft.updatedAt', 'DESC');

    if (limit) query.take(limit);
    return query.getMany();
  }

  async update(id: string, dto: Partial<FileEditorDraft>, userId: string): Promise<FileEditorDraft> {
    const draft = await this.findById(id);
    
    if (draft.userId !== userId) {
      throw new BadRequestException('Unauthorized to modify this draft');
    }

    Object.assign(draft, dto);
    draft.version += 1;
    draft.updatedAt = new Date();
    return this.draftRepo.save(draft);
  }

  async delete(id: string, userId: string): Promise<void> {
    const draft = await this.findById(id);
    
    if (draft.userId !== userId) {
      throw new BadRequestException('Unauthorized to delete this draft');
    }

    await this.draftRepo.remove(draft);
  }

  async convertFormat(id: string, targetFormat: string): Promise<{ convertedContent: string }> {
    const draft = await this.findById(id);
    
    // Placeholder conversion logic
    return { convertedContent: `[Converted from ${draft.format} to ${targetFormat}] ${draft.content}` };
  }
}
