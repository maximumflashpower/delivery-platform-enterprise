import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Driver } from '../entities/driver.entity';
import { License } from '../entities/license.entity';
import { Compliance } from '../entities/compliance.entity';
import { DriverStatus } from '../enums/driver-status.enum';

@Injectable()
export class DriverService {
  private readonly logger = new Logger(DriverService.name);

  constructor(
    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,
    @InjectRepository(License)
    private readonly licenseRepo: Repository<License>,
    @InjectRepository(Compliance)
    private readonly complianceRepo: Repository<Compliance>,
  ) {}

  async findAll(): Promise<Array<{ id: string; driverCode: string; status: string; rating: number }>> {
    const drivers = await this.driverRepo.find({ where: { deletedAt: IsNull() }, order: { createdAt: 'DESC' } });
    return drivers.map(d => ({
      id: d.id,
      driverCode: d.driverCode,
      status: d.status,
      rating: Number(d.rating),
    }));
  }

  async findById(id: string): Promise<Driver> {
    const driver = await this.driverRepo.findOne({ where: { id, deletedAt: IsNull() }, relations: ['licenses', 'compliance'] });
    if (!driver) throw new NotFoundException(`Driver with ID ${id} not found`);
    return driver;
  }

  async findByUserId(userId: string): Promise<Driver[]> {
    return this.driverRepo.find({ where: { userId, deletedAt: IsNull() } });
  }

  async create(data: Partial<Driver>): Promise<Driver> {
    if (!data.driverCode) {
      throw new BadRequestException('driverCode and legalName are required');
    }
    const existing = await this.driverRepo.findOne({ where: { driverCode: data.driverCode } });
    if (existing && !existing.deletedAt) {
      throw new BadRequestException(`Driver code ${data.driverCode} already exists`);
    }
    const driver = this.driverRepo.create(data);
    return this.driverRepo.save(driver);
  }

  async update(id: string, data: Partial<Driver>): Promise<Driver> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.driverRepo.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const driver = await this.findById(id);
    await this.driverRepo.softDelete(id);
  }

  async verifyBackgroundCheck(driverId: string, checkId: string, expiryDate: Date): Promise<Driver> {
    const driver = await this.findById(driverId);
    driver.backgroundCheckId = checkId;
    driver.backgroundCheckExpiry = expiryDate;
    return this.driverRepo.save(driver);
  }

  async getStats(): Promise<{ totalDrivers: number; activeDrivers: number; averageRating: number }> {
    const totalResult = await this.driverRepo.createQueryBuilder('d')
      .select('COUNT(DISTINCT d.id)', 'total')
      .where('d.deletedAt IS NULL')
      .getRawOne();
    const totalDrivers = parseInt(totalResult?.total || '0', 10);

    const activeResult = await this.driverRepo.createQueryBuilder('d')
      .select('COUNT(DISTINCT d.id)', 'active')
      .where('d.deletedAt IS NULL')
      .andWhere('d.status = :status', { status: DriverStatus.ACTIVE })
      .getRawOne();
    const activeDrivers = parseInt(activeResult?.active || '0', 10);

    const avgResult = await this.driverRepo.createQueryBuilder('d')
      .select('AVG(d.rating)', 'avg')
      .where('d.deletedAt IS NULL')
      .getRawOne();
    const averageRating = parseFloat(avgResult?.avg || '0');

    return { totalDrivers, activeDrivers, averageRating };
  }
}
