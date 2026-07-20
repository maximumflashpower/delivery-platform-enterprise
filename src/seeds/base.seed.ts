import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';

export interface SeedRunner {
  order: number;
  name: string;
  run: (dataSource: DataSource) => Promise<void>;
}
