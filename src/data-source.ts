import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'lumo_admin',
  password: process.env.DB_PASSWORD || 'LumoSecurePass2026',
  database: process.env.DB_DATABASE || 'bankchat_core',
  entities: ['src/modules/**/entities/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations_history',
  logging: process.env.DB_LOGGING === 'true',
  synchronize: false,
});
