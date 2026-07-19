import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { License } from '../entities/license.entity';
import { LicenseStatus } from '../enums/license-status.enum';

@Injectable()
export class LicenseService {
  private readonly logger = new Logger(LicenseService.name);

  constructor(
    @InjectRepository(License)
    private readonly licenseRepo: Repository<License>,
  ) {}

  async findAll(): Promise<License[]> {
    return this.licenseRepo.find({ where: { deletedAt: IsNull() }, relations: { driver: true } });
  }

  async findByDriverId(driverId: string): Promise<License[]> {
    return this.licenseRepo.find({ 
      where: { driverId, deletedAt: IsNull() }, 
      relations: { driver: true },
      order: { expiryDate: 'ASC' } 
    });
  }

  async findById(id: string): Promise<License> {
    const license = await this.licenseRepo.findOne({ 
      where: { id, deletedAt: IsNull() }, 
      relations: { driver: true } 
    });
    if (!license) throw new NotFoundException(`License with ID ${id} not found`);
    return license;
  }

  async create(data: Partial<License>): Promise<License> {
    const license = this.licenseRepo.create(data);
    return this.licenseRepo.save(license);
  }

  async update(id: string, data: Partial<License>): Promise<License> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.licenseRepo.update(id, data);
    return this.findById(id);
  }

  async renew(id: string, newExpiryDate: Date): Promise<License> {
    const license = await this.findById(id);
    license.expiryDate = newExpiryDate;
    license.status = LicenseStatus.VALID;
    return this.licenseRepo.save(license);
  }

  async expire(id: string): Promise<License> {
    const license = await this.findById(id);
    license.status = LicenseStatus.EXPIRED;
    return this.licenseRepo.save(license);
  }

  async suspend(id: string, reason?: string): Promise<License> {
    const license = await this.findById(id);
    license.status = LicenseStatus.SUSPENDED;
    return this.licenseRepo.save(license);
  }
}
