import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default {
  type: 'better-sqlite3',
  database: 'dev.db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: ['query', 'error'],
} as TypeOrmModuleOptions;
