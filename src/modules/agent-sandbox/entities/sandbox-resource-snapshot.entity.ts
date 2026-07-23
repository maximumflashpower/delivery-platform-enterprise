import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('sandbox_resource_snapshots')
export class SandboxResourceSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  sandboxId: string;

  @Column('uuid')
  executionId: string;

  @Column('int', { default: 0 })
  cpuPercent: number;

  @Column('int', { default: 0 })
  memoryMb: number;

  @Column('int', { default: 0 })
  diskMb: number;

  @Column('int', { default: 0 })
  networkInKb: number;

  @Column('int', { default: 0 })
  networkOutKb: number;

  @Column('int', { default: 0 })
  activeConnections: number;

  @Column('int', { default: 0 })
  tokenRate: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
