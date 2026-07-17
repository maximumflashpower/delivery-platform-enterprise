import { Entity, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ExecutionStatus } from '../enums/execution-status.enum';

@Entity('contract_executions')
export class ContractExecution extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'contractId', type: 'uuid' })
  contractId: string;

  @Column({ name: 'functionName', type: 'varchar', length: '255' })
  functionName: string;

  @Column({ name: 'functionArgs', type: 'jsonb', nullable: true })
  functionArgs: Record<string, any> | null;

  @Column({ type: 'enum', enum: ExecutionStatus, default: ExecutionStatus.QUEUED })
  status: ExecutionStatus;

  @Column({ name: 'initiatedByUserId', type: 'uuid' })
  initiatedByUserId: string;

  @Column({ name: 'transactionHash', type: 'varchar', length: '255', nullable: true })
  transactionHash: string | null;

  @Column({ name: 'blockNumber', type: 'bigint', nullable: true })
  blockNumber: number | null;

  @Column({ name: 'gasUsed', type: 'bigint', nullable: true })
  gasUsed: number | null;

  @Column({ name: 'result', type: 'jsonb', nullable: true })
  result: Record<string, any> | null;

  @Column({ name: 'error', type: 'text', nullable: true })
  error: string | null;

  @Column({ name: 'executedAt', type: 'timestamp with time zone', nullable: true })
  executedAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
