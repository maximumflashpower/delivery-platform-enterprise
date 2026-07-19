import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '..', 'dev.db'),
  entities: [path.join(__dirname, '..', 'src', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '..', 'src', 'migrations', '*{.ts,.js}')],
  synchronize: false,
  logging: true,
});

async function runMigrations() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
    
    await AppDataSource.runMigrations();
    console.log('Migrations executed successfully!');
    
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

runMigrations();
