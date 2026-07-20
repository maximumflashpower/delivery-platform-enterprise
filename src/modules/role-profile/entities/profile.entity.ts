import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ProfileVisibility {
  PUBLIC = 'public',
  PROFILE_VISIBLE = 'profile_visible',
  MEMBERS_ONLY = 'members_only',
  PRIVATE = 'private'
}

export enum ProfileVerificationLevel {
  UNVERIFIED = 'unverified',
  EMAIL_VERIFIED = 'email_verified',
  PHONE_VERIFIED = 'phone_verified',
  GOVERNMENT_ID = 'government_id',
  BUSINESS_VERIFIED = 'business_verified'
}

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'user_id', unique: true })
  userId: string;

  @Column({ type: 'varchar', length: 50, default: ProfileVisibility.PRIVATE })
  visibility: ProfileVisibility;

  @Column({ type: 'varchar', length: 50, default: ProfileVerificationLevel.UNVERIFIED })
  verification_level: ProfileVerificationLevel;

  @Column({ type: 'varchar', length: 255, nullable: true })
  display_name: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar_url: string | null;

  @Column({ type: 'text', nullable: true })
  skills: string | null;

  @Column({ type: 'text', nullable: true })
  interests: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website_url: string | null;

  @Column({ type: 'text', nullable: true })
  social_links: string | null;

  @Column({ type: 'text', nullable: true })
  achievements: string | null;

  @Column({ type: 'text', nullable: true })
  preferences: string | null;

  @Column({ default: false })
  is_complete: boolean;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'datetime', nullable: true })
  verified_at: Date | null;

  @Column({ type: 'datetime', nullable: true })
  last_activity_at: Date | null;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
