import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ConfigScope } from '../enums/config-scope.enum';
import { ConfigType } from '../enums/config-type.enum';

@Entity('configurations')
export class Configuration extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'configKey', type: 'varchar', length: 255, unique: true })
  configKey: string;

  @Column({ name: 'configName', type: 'varchar', length: 255 })
  configName: string;

  @Column({ type: 'varchar', enum: ConfigType })
  configType: ConfigType;

  @Column({ type: 'varchar', enum: ConfigScope, default: ConfigScope.GLOBAL })
  scope: ConfigScope;

  @Column({ name: 'scopeIdentifier', type: 'varchar', length: 255, nullable: true })
  scopeIdentifier: string | null;

  @Column({ type: 'text' })
  value: string;

  @Column({ name: 'defaultValue', type: 'text', nullable: true })
  defaultValue: string | null;

  @Column({ type: 'text', nullable: true })
  schemaDefinition: Record<string, any> | null;

  @Column({ name: 'isEncrypted', type: 'boolean', default: false })
  isEncrypted: boolean;

  @Column({ name: 'isReadOnly', type: 'boolean', default: false })
  isReadOnly: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ name: 'modifiedByUserId', type: 'varchar' })
  modifiedByUserId: string;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
