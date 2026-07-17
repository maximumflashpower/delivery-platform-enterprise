import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ContractStatus } from '../enums/contract-status.enum';

@Entity('smart_contracts')
export class SmartContract extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'contractName', type: 'varchar', length: '255' })
  contractName: string;

  @Column({ name: 'contractAddress', type: 'varchar', length: '255', unique: true, nullable: true })
  contractAddress: string | null;

  @Column({ name: 'network', type: 'varchar', length: '50', default: "'ethereum'" })
  network: string;

  @Column({ type: 'enum', enum: ContractStatus, default: ContractStatus.DRAFT })
  status: ContractStatus;

  @Column({ name: 'bytecode', type: 'text', nullable: true })
  bytecode: string | null;

  @Column({ name: 'abi', type: 'jsonb', nullable: true })
  abi: Record<string, any> | null;

  @Column({ name: 'creatorUserId', type: 'uuid' })
  creatorUserId: string;

  @Column({ name: 'deployedAt', type: 'timestamp with time zone', nullable: true })
  deployedAt: Date | null;

  @Column({ name: 'transactionHash', type: 'varchar', length: '255', nullable: true })
  transactionHash: string | null;

  @Column({ name: 'gasUsed', type: 'bigint', nullable: true })
  gasUsed: number | null;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
