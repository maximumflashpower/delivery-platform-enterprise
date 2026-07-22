import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('biometric_data_catalog')
export class BiometricDataCatalog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('varchar', { length: 20 })
  biometricType: string;

  @Column('varchar', { length: 100 })
  dataSource: string;

  @Column('varchar', { length: 50, default: 'anonymized' })
  dataTreatment: string;

  @Column('varchar', { length: 100 })
  storageLocation: string;

  @Column({ type: 'datetime', nullable: true })
  lastAccessedAt: Date | null;

  @Column({ type: 'int', default: 0 })
  accessCount: number;

  @Column('boolean', { default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
