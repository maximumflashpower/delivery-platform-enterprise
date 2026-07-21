import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileRights } from '../entities/file-rights.entity';
import { CreateFileRightsDto } from '../dto/create-file-rights.dto';

@Injectable()
export class FileRightsService {
  constructor(
    @InjectRepository(FileRights)
    private readonly repo: Repository<FileRights>,
  ) {}

  async create(dto: CreateFileRightsDto): Promise<FileRights> {
    const rights = new FileRights();
    rights.fileId = dto.fileId;
    rights.rightsHolderId = dto.rightsHolderId;
    rights.rightsType = dto.rightsType as any;
    rights.license = dto.license || '';
    rights.licenseUrl = dto.licenseUrl || '';
    rights.validFrom = dto.validFrom ? new Date(dto.validFrom) : null;
    rights.validUntil = dto.validUntil ? new Date(dto.validUntil) : null;
    rights.usageRestrictions = dto.usageRestrictions || '';
    rights.attributionRequired = dto.attributionRequired || '';
    rights.commercialUseAllowed = dto.commercialUseAllowed ?? false;
    rights.modificationsAllowed = dto.modificationsAllowed ?? true;
    return this.repo.save(rights);
  }

  async findByFile(fileId: string): Promise<FileRights | null> {
    return this.repo.findOne({ where: { fileId } });
  }

  async findById(id: string): Promise<FileRights> {
    const rights = await this.repo.findOne({ where: { id } });
    if (!rights) throw new NotFoundException(`Rights ${id} not found`);
    return rights;
  }

  async update(id: string, dto: Partial<CreateFileRightsDto>): Promise<FileRights> {
    const rights = await this.findById(id);
    Object.assign(rights, dto);
    if (dto.validFrom) rights.validFrom = new Date(dto.validFrom);
    if (dto.validUntil) rights.validUntil = new Date(dto.validUntil);
    return this.repo.save(rights);
  }

  async remove(id: string): Promise<void> {
    const rights = await this.findById(id);
    await this.repo.remove(rights);
  }
}
