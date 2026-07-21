import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileCollaborator } from '../entities/file-collaborator.entity';
import { CreateFileCollaboratorDto } from '../dto/create-file-collaborator.dto';

@Injectable()
export class FileCollaboratorService {
  constructor(
    @InjectRepository(FileCollaborator)
    private readonly repo: Repository<FileCollaborator>,
  ) {}

  async add(dto: CreateFileCollaboratorDto): Promise<FileCollaborator> {
    const existing = await this.repo.findOne({
      where: { fileId: dto.fileId, userId: dto.userId },
    });
    if (existing) throw new BadRequestException('User is already a collaborator');

    const collab = new FileCollaborator();
    collab.fileId = dto.fileId;
    collab.userId = dto.userId;
    collab.role = (dto.role as any) || 'viewer';
    collab.invitedBy = dto.invitedBy || null;
    collab.permissions = dto.permissions || '';
    collab.isActive = true;
    return this.repo.save(collab);
  }

  async findByFile(fileId: string): Promise<FileCollaborator[]> {
    return this.repo.find({ where: { fileId, isActive: true } });
  }

  async updateRole(id: string, role: string): Promise<FileCollaborator> {
    const collab = await this.repo.findOne({ where: { id } });
    if (!collab) throw new NotFoundException(`Collaborator ${id} not found`);
    collab.role = role as any;
    return this.repo.save(collab);
  }

  async accept(id: string): Promise<FileCollaborator> {
    const collab = await this.repo.findOne({ where: { id } });
    if (!collab) throw new NotFoundException(`Collaborator ${id} not found`);
    collab.acceptedAt = new Date();
    return this.repo.save(collab);
  }

  async remove(id: string): Promise<void> {
    const collab = await this.repo.findOne({ where: { id } });
    if (!collab) throw new NotFoundException(`Collaborator ${id} not found`);
    collab.isActive = false;
    await this.repo.save(collab);
  }

  async getPermissions(fileId: string, userId: string): Promise<string> {
    const collab = await this.repo.findOne({ where: { fileId, userId, isActive: true } });
    return collab ? collab.role : 'none';
  }
}
