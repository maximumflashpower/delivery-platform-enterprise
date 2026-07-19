import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { ReservationStatus } from '../enums/reservation-status.enum';

@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) {}

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepo.find({ 
      where: { deletedAt: IsNull() }, 
      relations: { listing: true, guest: true } as any,
      order: { createdAt: 'DESC' } 
    });
  }

  async findById(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepo.findOne({ 
      where: { id, deletedAt: IsNull() },
      relations: { listing: true, guest: true } as any
    });
    if (!reservation) throw new NotFoundException(`Reservation with ID ${id} not found`);
    return reservation;
  }

  async findByGuestId(guestId: string): Promise<Reservation[]> {
    return this.reservationRepo.find({ 
      where: { guestId, deletedAt: IsNull() },
      relations: { listing: true } as any,
      order: { checkInDate: 'ASC' }
    });
  }

  async findByListingId(listingId: string): Promise<Reservation[]> {
    return this.reservationRepo.find({ 
      where: { listingId, deletedAt: IsNull() },
      relations: { guest: true } as any,
      order: { checkInDate: 'ASC' }
    });
  }

  async create(data: Partial<Reservation>): Promise<Reservation> {
    if (!data.reservationCode || !data.totalPrice) {
      throw new BadRequestException('reservationCode and totalPrice are required');
    }
    const reservation = this.reservationRepo.create(data);
    return this.reservationRepo.save(reservation);
  }

  async confirm(id: string): Promise<Reservation> {
    const reservation = await this.findById(id);
    reservation.status = ReservationStatus.CONFIRMED;
    return this.reservationRepo.save(reservation);
  }

  async checkIn(id: string): Promise<Reservation> {
    const reservation = await this.findById(id);
    reservation.status = ReservationStatus.CHECKED_IN;
    reservation.checkedInAt = new Date();
    return this.reservationRepo.save(reservation);
  }

  async checkOut(id: string): Promise<Reservation> {
    const reservation = await this.findById(id);
    reservation.status = ReservationStatus.COMPLETED;
    reservation.checkedOutAt = new Date();
    return this.reservationRepo.save(reservation);
  }

  async cancel(id: string, refund: boolean = true): Promise<Reservation> {
    const reservation = await this.findById(id);
    reservation.status = refund ? ReservationStatus.REFUNDED : ReservationStatus.CANCELLED;
    return this.reservationRepo.save(reservation);
  }
}
