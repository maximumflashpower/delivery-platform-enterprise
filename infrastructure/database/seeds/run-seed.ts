#!/usr/bin/env node
/**
 * Seeder Runner - Ejecuta todos los seeders en orden
 * Uso: npm run seed
 */
import { DataSource } from 'typeorm';
import { runInitialSeed } from './initial-seed';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('🌱 Iniciando proceso de seeding...\n');

  const dbType = process.env.DB_TYPE || 'sqlite';
  const dbPath = process.env.DB_PATH || './dev.db';

  const dataSource = new DataSource({
    type: dbType as 'sqlite',
    database: dbPath,
    entities: ['src/modules/**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: false,
  });

  await dataSource.initialize();
  console.log('📦 Conexión a base de datos establecida\n');

  try {
    await runInitialSeed(dataSource);
    console.log('\n✨ Todos los seeders completados.');
  } catch (error) {
    console.error('\n💥 Error durante el seeding:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Conexión cerrada.');
  }
}

main();
