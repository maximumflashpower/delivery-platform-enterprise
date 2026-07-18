import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const gettypeormConfig = (): TypeOrmModuleOptions => {
  return {
    type: process.env.TYPEORM_CONNECTION as 'sqlite' | 'postgres' || 'sqlite',
    database: process.env.TYPEORM_DATABASE || 'dev.db',
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT || '5432', 10),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
  };
};
