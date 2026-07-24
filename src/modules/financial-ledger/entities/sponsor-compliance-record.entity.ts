import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ComplianceCheckType {
  TAX_DOCUMENTS = 'tax_documents',
  KYC_VERIFICATION = 'kyc_verification',
  AD_DISCLOSURE = 'ad_disclosure',
  PAYMENT_VERIFICATION = 'payment_verification',
  LEGAL_CONTRACT = 'legal_contract',
  DATA_PRIVACY = 'data_privacy',
  CONTENT_POLICY = 'content_policy',
  FINANCIAL_AUDIT = 'financial_audit',
}

export enum ComplianceAction {
  DOCUMENT_SUBMITTED = 'document_submitted',
  VERIFICATION_PASSED = 'verification_passed',
  VERIFICATION_FAILED = 'verification_failed',
  REMEDIATION_REQUIRED = 'remediation_required',
  EXEMPTION_GRANTED = 'exemption_granted',
  MANUAL_REVIEW = 'manual_review',
  AUTO_APPROVED = 'auto_approved',
}

@Index(['sponsorId', 'checkType'])
@Entity('sponsor_compliance_records')
export class SponsorComplianceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sponsorId: string;

  @Column({ type: 'varchar', length: 255 })
  sponsorName: string;

  @Column({ type: 'varchar', length: 50 })
  checkType: ComplianceCheckType;

  @Column({ type: 'varchar', length: 50 })
  action: ComplianceAction;

  @Column({ type: 'boolean', default: false })
  isPassed: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  documents: Record<string, any>[];

  @Column({ type: 'json', nullable: true })
  findings: Record<string, any>[];

  @Column({ type: 'text', nullable: true })
  reviewerNotes: string;

  @Column({ type: 'uuid', nullable: true })
  reviewedBy: string;

  @Column({ type: 'date', nullable: true })
  expiresAt: Date;

  @Column({ type: 'date', nullable: true })
  nextReviewDue: Date;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  reviewStatus: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
