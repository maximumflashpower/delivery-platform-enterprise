import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const dbType = (process.env.TYPEORM_CONNECTION || 'sqlite') as 'sqlite' | 'postgres';

export default new DataSource({
  type: dbType,
  database: process.env.TYPEORM_DATABASE || 'dev.db',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT || '5432', 10),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  entities: ['src/modules/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: ['error'],
});
