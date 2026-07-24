import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreativeListing, ListingStatus } from '../entities/creative-listing.entity';
import { CreateListingDto, UpdateListingDto, BookListingDto, SubmitReviewDto } from '../dto/creative-listing.dto';

@Injectable()
export class CreativeMarketplaceService {
  private readonly logger = new Logger(CreativeMarketplaceService.name);

  constructor(
    @InjectRepository(CreativeListing)
    private readonly repo: Repository<CreativeListing>,
  ) {}

  async create(dto: CreateListingDto): Promise<CreativeListing> {
    const listing = this.repo.create({
      ...dto,
      status: ListingStatus.DRAFT,
    });
    return this.repo.save(listing);
  }

  async findAll(filters?: { category?: string; status?: string; creatorId?: string; minPrice?: number; maxPrice?: number }): Promise<CreativeListing[]> {
    const qb = this.repo.createQueryBuilder('listing');
    
    if (filters?.category) qb.andWhere('listing.category = :category', { category: filters.category });
    if (filters?.status) qb.andWhere('listing.status = :status', { status: filters.status });
    if (filters?.creatorId) qb.andWhere('listing.creatorId = :creatorId', { creatorId: filters.creatorId });
    if (filters?.minPrice) qb.andWhere('listing.basePrice >= :minPrice', { minPrice: filters.minPrice });
    if (filters?.maxPrice) qb.andWhere('listing.basePrice <= :maxPrice', { maxPrice: filters.maxPrice });
    
    qb.orderBy('list.createdAt', 'DESC');
    return qb.getMany();
  }

  async findOne(id: string): Promise<CreativeListing> {
    const listing = await this.repo.findOne({ where: { id } });
    if (!listing) throw new NotFoundException(`Listing ${id} not found`);
    return listing;
  }

  async update(id: string, dto: UpdateListingDto): Promise<CreativeListing> {
    const listing = await this.findOne(id);
    Object.assign(listing, dto);
    return this.repo.save(listing);
  }

  async publish(id: string): Promise<CreativeListing> {
    const listing = await this.findOne(id);
    if (listing.status !== ListingStatus.DRAFT && listing.status !== ListingStatus.PAUSED) {
      throw new BadRequestException(`Cannot publish listing in status ${listing.status}`);
    }
    listing.status = ListingStatus.PUBLISHED;
    listing.publishedAt = new Date();
    listing.acceptingOrders = true;
    return this.repo.save(listing);
  }

  async pause(id: string): Promise<CreativeListing> {
    const listing = await this.findOne(id);
    listing.status = ListingStatus.PAUSED;
    listing.acceptingOrders = false;
    return this.repo.save(listing);
  }

  async book(id: string, dto: BookListingDto): Promise<CreativeListing> {
    const listing = await this.findOne(id);
    if (!listing.acceptingOrders) throw new BadRequestException('Listing not accepting orders');
    if (listing.status !== ListingStatus.PUBLISHED) throw new BadRequestException(`Listing not available (status: ${listing.status})`);

    listing.status = ListingStatus.BOOKED;
    listing.totalBookings += 1;

    // Store booking info in portfolioItems for now (could be a separate entity later)
    const booking = {
      bookingId: crypto.randomUUID(),
      ...dto,
      bookedAt: new Date().toISOString(),
    };
    listing.portfolioItems = [...(listing.portfolioItems || []), { type: 'booking', data: booking }];

    this.logger.log(`Listing booked: ${id} by ${dto.clientName}`);
    return this.repo.save(listing);
  }

  async completeProject(id: string): Promise<CreativeListing> {
    const listing = await this.findOne(id);
    listing.status = ListingStatus.COMPLETED;
    listing.completedProjects += 1;
    return this.repo.save(listing);
  }

  async archive(id: string): Promise<CreativeListing> {
    const listing = await this.findOne(id);
    listing.status = ListingStatus.ARCHIVED;
    listing.acceptingOrders = false;
    return this.repo.save(listing);
  }

  async addReview(id: string, dto: SubmitReviewDto): Promise<CreativeListing> {
    const listing = await this.findOne(id);
    const oldRating = listing.rating;
    const oldCount = listing.completedProjects || 1;
    listing.rating = ((oldRating * oldCount) + dto.rating) / (oldCount + 1);

    const review = { reviewId: crypto.randomUUID(), ...dto, createdAt: new Date().toISOString() };
    listing.portfolioItems = [...(listing.portfolioItems || []), { type: 'review', data: review }];

    return this.repo.save(listing);
  }

  async getByCategory(category: string): Promise<CreativeListing[]> {
    return this.repo.find({ where: { category: category as any, status: ListingStatus.PUBLISHED }, order: { rating: 'DESC' } });
  }

  async getTopCreators(limit: number = 10): Promise<CreativeListing[]> {
    return this.repo.find({
      where: { status: ListingStatus.PUBLISHED },
      order: { rating: 'DESC', completedProjects: 'DESC' },
      take: limit,
    });
  }

  async getStats(): Promise<{
    totalListings: number;
    published: number;
    booked: number;
    completed: number;
    archived: number;
    totalBookings: number;
    avgRating: number;
    totalRevenue: number;
  }> {
    const all = await this.repo.find();
    return {
      totalListings: all.length,
      published: all.filter(l => l.status === ListingStatus.PUBLISHED).length,
      booked: all.filter(l => l.status === ListingStatus.BOOKED).length,
      completed: all.filter(l => l.status === ListingStatus.COMPLETED).length,
      archived: all.filter(l => l.status === ListingStatus.ARCHIVED).length,
      totalBookings: all.reduce((sum, l) => sum + l.totalBookings, 0),
      avgRating: all.length > 0 ? all.reduce((sum, l) => sum + l.rating, 0) / all.length : 0,
      totalRevenue: all.reduce((sum, l) => sum + (l.completedProjects * parseFloat(l.basePrice.toString())), 0),
    };
  }
}
