import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';
import { VehicleType } from '../enums/vehicle-type.enum';
import { VehicleStatus } from '../enums/vehicle-status.enum';

@Injectable()
export class VehicleCapabilityService {
  private readonly logger = new Logger(VehicleCapabilityService.name);

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
  ) {}

  async createVehicle(data: {
    plateNumber: string;
    ownerId?: string;
    model: string;
    type: VehicleType;
    color?: string;
    capacity?: Record<string, number>;
  }): Promise<Vehicle> {
    const existing = await this.vehicleRepo.findOne({ where: { plateNumber: data.plateNumber } });
    if (existing) throw new BadRequestException(`Vehicle with plate ${data.plateNumber} already exists`);

    const vehicle = this.vehicleRepo.create({
      ...data,
      status: VehicleStatus.AVAILABLE,
    });
    this.logger.log(`Vehicle ${data.plateNumber} created for owner ${data.ownerId || 'unassigned'}`);
    return this.vehicleRepo.save(vehicle);
  }

  async findAllVehicles(where?: Partial<Vehicle>): Promise<Vehicle[]> {
    return this.vehicleRepo.find({
      where: where || {},
      relations: ['owner'],
      order: { createdAt: 'DESC' },
    });
  }

  async findVehicleById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async findVehicleByPlate(plateNumber: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findOne({
      where: { plateNumber },
      relations: ['owner'],
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async findVehiclesByOwner(ownerId: string): Promise<Vehicle[]> {
    return this.vehicleRepo.find({
      where: { ownerId },
      relations: ['owner'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAvailableVehicles(): Promise<Vehicle[]> {
    return this.vehicleRepo.find({
      where: { status: VehicleStatus.AVAILABLE },
      relations: ['owner'],
      order: { createdAt: 'DESC' },
    });
  }

  async findVehiclesByType(type: VehicleType): Promise<Vehicle[]> {
    return this.vehicleRepo.find({
      where: { type },
      relations: ['owner'],
      order: { createdAt: 'DESC' },
    });
  }

  async findVehiclesByStatus(status: VehicleStatus): Promise<Vehicle[]> {
    return this.vehicleRepo.find({
      where: { status },
      relations: ['owner'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = await this.findVehicleById(id);
    Object.assign(vehicle, data);
    return this.vehicleRepo.save(vehicle);
  }

  async setVehicleStatus(id: string, status: VehicleStatus): Promise<Vehicle> {
    const vehicle = await this.findVehicleById(id);
    const previousStatus = vehicle.status;
    
    if (previousStatus === VehicleStatus.OFFLINE && status !== VehicleStatus.AVAILABLE) {
      throw new BadRequestException('Offline vehicles must be marked as available first');
    }
    
    vehicle.status = status;
    this.logger.log(`Vehicle ${vehicle.plateNumber} status changed from ${previousStatus} to ${status}`);
    return this.vehicleRepo.save(vehicle);
  }

  async markAsBusy(id: string): Promise<Vehicle> {
    return this.setVehicleStatus(id, VehicleStatus.BUSY);
  }

  async markAsAvailable(id: string): Promise<Vehicle> {
    return this.setVehicleStatus(id, VehicleStatus.AVAILABLE);
  }

  async scheduleMaintenance(id: string, reason?: string): Promise<Vehicle> {
    const vehicle = await this.findVehicleById(id);
    vehicle.status = VehicleStatus.MAINTENANCE;
    if (reason) {
      // Store reason temporarily in capacity as numeric flag (1=maintenance in progress)
      // For proper text storage, you'd need a separate notes field
      vehicle.capacity = { ...vehicle.capacity, maintenanceMode: 1 };
    }
    this.logger.log(`Vehicle ${vehicle.plateNumber} scheduled for maintenance${reason ? ': ' + reason : ''}`);
    return this.vehicleRepo.save(vehicle);
  }

  async endMaintenance(id: string): Promise<Vehicle> {
    return this.setVehicleStatus(id, VehicleStatus.AVAILABLE);
  }

  async updateCapacity(id: string, capacity: Record<string, number>): Promise<Vehicle> {
    const vehicle = await this.findVehicleById(id);
    vehicle.capacity = { ...(vehicle.capacity || {}), ...capacity };
    return this.vehicleRepo.save(vehicle);
  }

  async getVehicleStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    const vehicles = await this.vehicleRepo.find();
    const stats: any = {
      total: vehicles.length,
      byType: {
        [VehicleType.CAR]: 0,
        [VehicleType.MOTORCYCLE]: 0,
        [VehicleType.VAN]: 0,
        [VehicleType.TRUCK]: 0,
        [VehicleType.BICYCLE]: 0,
        [VehicleType.SCOOTER]: 0,
      },
      byStatus: {
        [VehicleStatus.AVAILABLE]: 0,
        [VehicleStatus.BUSY]: 0,
        [VehicleStatus.MAINTENANCE]: 0,
        [VehicleStatus.OFFLINE]: 0,
      },
    };

    for (const v of vehicles) {
      stats.byType[v.type] = (stats.byType[v.type] || 0) + 1;
      stats.byStatus[v.status] = (stats.byStatus[v.status] || 0) + 1;
    }

    return stats;
  }
}
