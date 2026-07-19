import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ServiceBooking } from '../entities/service-booking.entity';
import { BookingStatus } from '../enums/booking-status.enum';

@Injectable()
export class ServiceBookingService {
  private readonly logger = new Logger(ServiceBookingService.name);

  constructor(
    @InjectRepository(ServiceBooking)
    private readonly bookingRepo: Repository<ServiceBooking>,
  ) {}

  async findAll(): Promise<ServiceBooking[]> {
    return this.bookingRepo.find({ 
      where: { deletedAt: IsNull() }, 
      relations: { provider: true, customer: true } as any,
      order: { createdAt: 'DESC' } 
    });
  }

  async findById(id: string): Promise<ServiceBooking> {
    const booking = await this.bookingRepo.findOne({ 
      where: { id, deletedAt: IsNull() },
      relations: { provider: true, customer: true } as any
    });
    if (!booking) throw new NotFoundException(`Booking with ID ${id} not found`);
    return booking;
  }

  async findByCustomerId(customerId: string): Promise<ServiceBooking[]> {
    return this.bookingRepo.find({ 
      where: { customerId, deletedAt: IsNull() },
      relations: { provider: true } as any,
      order: { createdAt: 'DESC' }
    });
  }

  async findByProviderId(providerId: string): Promise<ServiceBooking[]> {
    return this.bookingRepo.find({ 
      where: { providerId, deletedAt: IsNull() },
      relations: { customer: true } as any,
      order: { scheduledAt: 'ASC' }
    });
  }

  async create(data: Partial<ServiceBooking>): Promise<ServiceBooking> {
    if (!data.bookingCode || !data.serviceName) {
      throw new BadRequestException('bookingCode and serviceName are required');
    }
    const booking = this.bookingRepo.create(data);
    return this.bookingRepo.save(booking);
  }

  async confirm(id: string): Promise<ServiceBooking> {
    const booking = await this.findById(id);
    booking.status = BookingStatus.CONFIRMED;
    return this.bookingRepo.save(booking);
  }

  async start(id: string): Promise<ServiceBooking> {
    const booking = await this.findById(id);
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Cannot start booking that is not confirmed');
    }
    booking.status = BookingStatus.IN_PROGRESS;
    return this.bookingRepo.save(booking);
  }

  async complete(id: string): Promise<ServiceBooking> {
    const booking = await this.findById(id);
    booking.status = BookingStatus.COMPLETED;
    return this.bookingRepo.save(booking);
  }

  async cancel(id: string, reason?: string): Promise<ServiceBooking> {
    const booking = await this.findById(id);
    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepo.save(booking);
  }

  async markNoShow(id: string): Promise<ServiceBooking> {
    const booking = await this.findById(id);
    booking.status = BookingStatus.NO_SHOW;
    return this.bookingRepo.save(booking);
  }
}
