import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const dbType = process.env.DB_TYPE || 'sqlite';
const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'dev.db');

const isPostgres = dbType === 'postgres';

const dataSourceOptions: DataSourceOptions = {
  type: (isPostgres ? 'postgres' : 'better-sqlite3') as DataSourceOptions['type'],
  database: isPostgres ? undefined : dbPath,
  host: isPostgres ? process.env.DB_HOST : undefined,
  port: isPostgres ? parseInt(process.env.DB_PORT || '5432') : undefined,
  username: isPostgres ? process.env.DB_USERNAME : undefined,
  password: isPostgres ? process.env.DB_PASSWORD : undefined,
  databaseName: isPostgres ? process.env.DB_DATABASE : undefined,
  entities: [path.join(process.cwd(), 'src', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(process.cwd(), 'src', 'migrations', '*{.ts,.js}')],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
} as DataSourceOptions;

export const AppDataSource = new DataSource(dataSourceOptions);
