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
  display_name: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar_url: string;

  @Column({ type: 'text', nullable: true })
  skills: string;

  @Column({ type: 'text', nullable: true })
  interests: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website_url: string;

  @Column({ type: 'text', nullable: true })
  social_links: string;

  @Column({ type: 'text', nullable: true })
  achievements: string;

  @Column({ type: 'text', nullable: true })
  preferences: string;

  @Column({ default: true })
  is_complete: boolean;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'datetime', nullable: true })
  verified_at: Date;

  @Column({ type: 'datetime', nullable: true })
  last_activity_at: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
