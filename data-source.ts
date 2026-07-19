import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(process.cwd(), 'dev.db'),
  entities: [path.join(process.cwd(), 'src', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(process.cwd(), 'src', 'migrations', '*{.ts,.js}')],
  synchronize: true,
  logging: false,
});
