#!/usr/bin/env node
/**
 * Seeder Runner - Ejecuta todos los seeders en orden
 *
 * Uso: npm run seed
 */
import { DataSource } from 'typeorm';
import { TypeOrmConfigService } from '../../src/config/typeorm-config.service';
import { runInitialSeed } from './initial-seed';

async function main() {
  console.log('🌱 Iniciando proceso de seeding...\n');

  const configService = new TypeOrmConfigService();
  const dataSource = new DataSource(
    configService.createTypeOrmOptions() as any,
  );

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
