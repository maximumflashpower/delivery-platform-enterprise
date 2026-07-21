import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileVersion } from '../entities/file-version.entity';
import { CreateFileVersionDto } from '../dto/create-file-version.dto';

@Injectable()
export class FileVersionService {
  constructor(
    @InjectRepository(FileVersion)
    private readonly repo: Repository<FileVersion>,
  ) {}

  async create(dto: CreateFileVersionDto): Promise<FileVersion> {
    // Marcar versiones anteriores como no actuales
    await this.repo.update({ fileId: dto.fileId }, { isCurrent: false });

    const count = await this.repo.count({ where: { fileId: dto.fileId } });
    const version = new FileVersion();
    version.fileId = dto.fileId;
    version.createdByUserId = dto.createdByUserId;
    version.versionNumber = count + 1;
    version.content = dto.content;
    version.format = dto.format;
    version.changeDescription = dto.changeDescription || '';
    version.isCurrent = dto.isCurrent ?? true;
    version.sizeBytes = dto.sizeBytes || 0;
    return this.repo.save(version);
  }

  async findByFile(fileId: string): Promise<FileVersion[]> {
    return this.repo.find({
      where: { fileId },
      order: { versionNumber: 'DESC' },
    });
  }

  async findCurrent(fileId: string): Promise<FileVersion> {
    const version = await this.repo.findOne({
      where: { fileId, isCurrent: true },
    });
    if (!version) throw new NotFoundException(`No current version for file ${fileId}`);
    return version;
  }

  async findById(id: string): Promise<FileVersion> {
    const version = await this.repo.findOne({ where: { id } });
    if (!version) throw new NotFoundException(`Version ${id} not found`);
    return version;
  }

  async revertTo(fileId: string, versionNumber: number, userId: string): Promise<FileVersion> {
    const target = await this.repo.findOne({
      where: { fileId, versionNumber },
    });
    if (!target) throw new NotFoundException(`Version ${versionNumber} not found`);

    return this.create({
      fileId,
      createdByUserId: userId,
      content: target.content,
      format: target.format,
      changeDescription: `Reverted to version ${versionNumber}`,
      sizeBytes: target.sizeBytes,
    });
  }

  async compare(v1Id: string, v2Id: string): Promise<{ v1: FileVersion; v2: FileVersion; identical: boolean }> {
    const v1 = await this.findById(v1Id);
    const v2 = await this.findById(v2Id);
    return { v1, v2, identical: v1.content === v2.content };
  }
}
