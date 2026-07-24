import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ListingStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  PAUSED = 'paused',
  BOOKED = 'booked',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum CreativeCategory {
  VIDEO_EDITING = 'video_editing',
  GRAPHIC_DESIGN = 'graphic_design',
  COPYWRITING = 'copywriting',
  PHOTOGRAPHY = 'photography',
  MOTION_GRAPHICS = 'motion_graphics',
  BRAND_IDENTITY = 'brand_identity',
  WEB_DESIGN = 'web_design',
  SOCIAL_MEDIA = 'social_media',
  CONTENT_STRATEGY = 'content_strategy',
  ILLUSTRATION = 'illustration',
}

@Entity('creative_listings')
export class CreativeListing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  category: CreativeCategory;

  @Column({ type: 'varchar', length: 50, default: ListingStatus.DRAFT })
  status: ListingStatus;

  @Column({ type: 'uuid' })
  creatorId: string;

  @Column({ type: 'varchar', length: 255 })
  creatorName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'json', nullable: true })
  portfolioItems: Record<string, any>[];

  @Column({ type: 'json', nullable: true })
  deliverables: Record<string, any>[];

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'integer', default: 3 })
  revisionLimit: number;

  @Column({ type: 'integer', nullable: true })
  estimatedDeliveryDays: number;

  @Column({ type: 'json', nullable: true })
  pricingTiers: Record<string, any>[];

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'integer', default: 0 })
  totalBookings: number;

  @Column({ type: 'integer', default: 0 })
  completedProjects: number;

  @Column({ type: 'boolean', default: true })
  acceptingOrders: boolean;

  @Column({ type: 'uuid', nullable: true })
  merchantId: string;

  @Column({ type: 'datetime', nullable: true })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
