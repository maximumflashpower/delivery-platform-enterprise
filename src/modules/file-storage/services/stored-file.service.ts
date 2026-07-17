import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoredFile } from '../entities/stored-file.entity';

@Injectable()
export class StoredFileService {
  constructor(
    @InjectRepository(StoredFile)
    private readonly fileRepo: Repository<StoredFile>,
  ) {}

  async findAll(bucketId?: string): Promise<StoredFile[]> {
    return this.fileRepo.find({ where: bucketId ? { bucketId } as any : {} });
  }

  async findOne(id: string): Promise<StoredFile | null> {
    return this.fileRepo.findOneBy({ id });
  }

  async create(data: Partial<StoredFile>): Promise<StoredFile> {
    const entity = this.fileRepo.create(data);
    return this.fileRepo.save(entity);
  }

  async update(id: string, data: Partial<StoredFile>): Promise<StoredFile | null> {
    await this.fileRepo.update(id, data);
    return this.fileRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.fileRepo.delete(id);
  }
}
