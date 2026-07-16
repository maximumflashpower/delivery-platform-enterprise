import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride } from '../entities/ride.entity';
import { RideStatus } from '../enums/ride-status.enum';
import { RideType } from '../enums/ride-type.enum';

@Injectable()
export class MobilityRideService {
  private readonly logger = new Logger(MobilityRideService.name);

  private readonly fareRates: Record<RideType, { base: number; perKm: number; multiplier: number }> = {
    [RideType.STANDARD]: { base: 15, perKm: 5, multiplier: 1 },
    [RideType.PREMIUM]: { base: 25, perKm: 8, multiplier: 1.5 },
    [RideType.SHARED]: { base: 10, perKm: 3, multiplier: 0.7 },
    [RideType.COURIER]: { base: 20, perKm: 6, multiplier: 1.2 },
  };

  constructor(
    @InjectRepository(Ride)
    private readonly rideRepo: Repository<Ride>,
  ) {}

  async createRide(data: {
    rideId: string;
    passengerId?: string;
    driverId?: string;
    type: RideType;
    locations?: Record<string, { lat: number; lng: number; address: string }>;
  }): Promise<Ride> {
    const existing = await this.rideRepo.findOne({ where: { rideId: data.rideId } });
    if (existing) throw new BadRequestException(`Ride ${data.rideId} already exists`);

    const ride = this.rideRepo.create({
      rideId: data.rideId,
      passengerId: data.passengerId,
      driverId: data.driverId,
      type: data.type,
      locations: data.locations,
      status: RideStatus.REQUESTED,
    });
    this.logger.log(`Ride ${data.rideId} created by passenger ${data.passengerId || 'anonymous'}`);
    return this.rideRepo.save(ride);
  }

  async findAllRides(where?: Partial<Ride>): Promise<Ride[]> {
    return this.rideRepo.find({
      where: where || {},
      relations: ['passenger', 'driver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findRideById(id: string): Promise<Ride> {
    const ride = await this.rideRepo.findOne({
      where: { id },
      relations: ['passenger', 'driver'],
    });
    if (!ride) throw new NotFoundException('Ride not found');
    return ride;
  }

  async findRideByRideId(rideId: string): Promise<Ride> {
    const ride = await this.rideRepo.findOne({
      where: { rideId },
      relations: ['passenger', 'driver'],
    });
    if (!ride) throw new NotFoundException('Ride not found');
    return ride;
  }

  async findRidesByPassenger(passengerId: string): Promise<Ride[]> {
    return this.rideRepo.find({
      where: { passengerId },
      relations: ['passenger', 'driver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findRidesByDriver(driverId: string): Promise<Ride[]> {
    return this.rideRepo.find({
      where: { driverId },
      relations: ['passenger', 'driver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findRidesByStatus(status: RideStatus): Promise<Ride[]> {
    return this.rideRepo.find({
      where: { status },
      relations: ['passenger', 'driver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveRides(): Promise<Ride[]> {
    const statuses = [RideStatus.REQUESTED, RideStatus.ACCEPTED, RideStatus.IN_PROGRESS];
    return this.rideRepo.find({
      where: statuses.map(s => ({ status: s })),
      relations: ['passenger', 'driver'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateRide(id: string, data: Partial<Ride>): Promise<Ride> {
    const ride = await this.findRideById(id);
    Object.assign(ride, data);
    return this.rideRepo.save(ride);
  }

  async calculateEstimatedFare(type: RideType, distanceKm: number, durationMin: number): Promise<number> {
    const rates = this.fareRates[type];
    const baseFare = rates.base * rates.multiplier;
    const distanceCost = distanceKm * rates.perKm * rates.multiplier;
    const timeCost = (durationMin / 60) * 10 * rates.multiplier;
    
    return Math.round((baseFare + distanceCost + timeCost) * 100) / 100;
  }

  async acceptRide(id: string, driverId: string): Promise<Ride> {
    const ride = await this.findRideById(id);

    if (ride.status !== RideStatus.REQUESTED) {
      throw new BadRequestException(`Cannot accept ride with status: ${ride.status}`);
    }

    ride.driverId = driverId;
    ride.status = RideStatus.ACCEPTED;
    this.logger.log(`Ride ${ride.rideId} accepted by driver ${driverId}`);
    return this.rideRepo.save(ride);
  }

  async startRide(id: string): Promise<Ride> {
    const ride = await this.findRideById(id);

    if (ride.status !== RideStatus.ACCEPTED) {
      throw new BadRequestException(`Cannot start ride with status: ${ride.status}`);
    }

    ride.status = RideStatus.IN_PROGRESS;
    this.logger.log(`Ride ${ride.rideId} started`);
    return this.rideRepo.save(ride);
  }

  async completeRide(id: string, fare?: number, locations?: Record<string, { lat: number; lng: number; address: string }>): Promise<Ride> {
    const ride = await this.findRideById(id);

    if (ride.status !== RideStatus.IN_PROGRESS) {
      throw new BadRequestException(`Cannot complete ride with status: ${ride.status}`);
    }

    ride.status = RideStatus.COMPLETED;
    if (fare !== undefined) {
      ride.fare = fare;
    }
    if (locations) {
      ride.locations = locations;
    }
    
    this.logger.log(`Ride ${ride.rideId} completed, fare: ${ride.fare}`);
    return this.rideRepo.save(ride);
  }

  async cancelRide(id: string, reason?: string): Promise<Ride> {
    const ride = await this.findRideById(id);

    if (![RideStatus.REQUESTED, RideStatus.ACCEPTED, RideStatus.IN_PROGRESS].includes(ride.status)) {
      throw new BadRequestException(`Cannot cancel ride with status: ${ride.status}`);
    }

    ride.status = RideStatus.CANCELLED;
    if (reason) {
      ride.locations = { ...ride.locations, cancellationReason: { lat: 0, lng: 0, address: reason } } as any;
    }
    this.logger.log(`Ride ${ride.rideId} cancelled${reason ? ': ' + reason : ''}`);
    return this.rideRepo.save(ride);
  }

  async markNoShow(id: string): Promise<Ride> {
    const ride = await this.findRideById(id);

    if (![RideStatus.ACCEPTED, RideStatus.IN_PROGRESS].includes(ride.status)) {
      throw new BadRequestException(`Cannot mark no-show for ride with status: ${ride.status}`);
    }

    ride.status = RideStatus.NO_SHOW;
    this.logger.warn(`Ride ${ride.rideId} marked as no-show`);
    return this.rideRepo.save(ride);
  }

  async assignDriver(rideId: string, driverId: string): Promise<Ride> {
    const ride = await this.findRideById(rideId);

    if (ride.status !== RideStatus.REQUESTED) {
      throw new BadRequestException(`Can only assign driver to rides in REQUESTED status`);
    }

    ride.driverId = driverId;
    this.logger.log(`Driver ${driverId} assigned to ride ${ride.rideId}`);
    return this.rideRepo.save(ride);
  }

  async updateFare(id: string, fare: number): Promise<Ride> {
    const ride = await this.findRideById(id);
    ride.fare = fare;
    return this.rideRepo.save(ride);
  }

  async updateLocations(id: string, locations: Record<string, { lat: number; lng: number; address: string }>): Promise<Ride> {
    const ride = await this.findRideById(id);
    ride.locations = locations;
    return this.rideRepo.save(ride);
  }

  async getRideStats(startDate?: Date, endDate?: Date): Promise<{
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    noShow: number;
    totalRevenue: number;
    averageFare: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    let rides = await this.rideRepo.find();
    
    if (startDate || endDate) {
      rides = rides.filter(r => {
        const rDate = r.createdAt;
        if (startDate && rDate < startDate) return false;
        if (endDate && rDate > endDate) return false;
        return true;
      });
    }

    const stats: any = {
      total: rides.length,
      active: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0,
      totalRevenue: 0,
      averageFare: 0,
      byType: {},
      byStatus: {},
    };

    let completedCount = 0;

    for (const r of rides) {
      stats.byType[r.type] = (stats.byType[r.type] || 0) + 1;
      stats.byStatus[r.status] = (stats.byStatus[r.status] || 0) + 1;

      if ([RideStatus.REQUESTED, RideStatus.ACCEPTED, RideStatus.IN_PROGRESS].includes(r.status)) {
        stats.active++;
      }

      if (r.status === RideStatus.COMPLETED) {
        stats.completed++;
        completedCount++;
        if (r.fare) {
          stats.totalRevenue += r.fare;
        }
      }

      if (r.status === RideStatus.CANCELLED) {
        stats.cancelled++;
      }

      if (r.status === RideStatus.NO_SHOW) {
        stats.noShow++;
      }
    }

    stats.averageFare = completedCount > 0 
      ? Math.round((stats.totalRevenue / completedCount) * 100) / 100 
      : 0;

    return stats;
  }
}
