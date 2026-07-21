import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as path from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbType = process.env.DB_TYPE || 'sqljs';
    const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'dev.db');
    const isDev = process.env.NODE_ENV === 'development';

    if (dbType === 'postgres') {
      return {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || './dev.db',
        entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
        migrations: [path.join(__dirname, '..', 'migrations', '*{ts,js}')],
        autoLoadEntities: true,
        synchronize: false,
        logging: false,
      };
    }

    // sql.js para desarrollo Docker (sin módulos nativos)
    return {
      type: 'sqljs',
      location: dbPath,
      autoSave: true,
      entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
      migrations: [path.join(__dirname, '..', 'migrations', '*{ts,js}')],
      autoLoadEntities: true,
      synchronize: isDev,
      logging: false,
    } as unknown as TypeOrmModuleOptions;
  }
}
