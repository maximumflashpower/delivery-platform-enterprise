import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { ListingStatus } from '../enums/listing-status.enum';
import { PropertyType } from '../enums/property-type.enum';

@Injectable()
export class ListingService {
  private readonly logger = new Logger(ListingService.name);

  constructor(
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
  ) {}

  async findAll(): Promise<Listing[]> {
    return this.listingRepo.find({ 
      where: { deletedAt: IsNull() }, 
      relations: { host: true },
      order: { createdAt: 'DESC' } 
    });
  }

  async findById(id: string): Promise<Listing> {
    const listing = await this.listingRepo.findOne({ 
      where: { id, deletedAt: IsNull() },
      relations: { host: true }
    });
    if (!listing) throw new NotFoundException(`Listing with ID ${id} not found`);
    return listing;
  }

  async findByHostId(hostId: string): Promise<Listing[]> {
    return this.listingRepo.find({ 
      where: { hostId, deletedAt: IsNull() },
      relations: { host: true },
      order: { createdAt: 'DESC' }
    });
  }

  async create(data: Partial<Listing>): Promise<Listing> {
    if (!data.listingCode || !data.title || !data.nightlyPrice) {
      throw new BadRequestException('listingCode, title, and nightlyPrice are required');
    }
    const listing = this.listingRepo.create(data);
    return this.listingRepo.save(listing);
  }

  async update(id: string, data: Partial<Listing>): Promise<Listing> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.listingRepo.update(id, data);
    return this.findById(id);
  }

  async approve(id: string): Promise<Listing> {
    const listing = await this.findById(id);
    listing.status = ListingStatus.ACTIVE;
    return this.listingRepo.save(listing);
  }

  async deactivate(id: string): Promise<Listing> {
    const listing = await this.findById(id);
    listing.status = ListingStatus.INACTIVE;
    return this.listingRepo.save(listing);
  }

  async block(id: string): Promise<Listing> {
    const listing = await this.findById(id);
    listing.status = ListingStatus.BLOCKED;
    return this.listingRepo.save(listing);
  }
}
