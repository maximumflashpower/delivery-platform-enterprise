import { AppDataSource } from '../src/config/database.datasource';

async function runMigrations() {
  try {
    await AppDataSource.initialize();
    console.log('✅ DataSource initialized');
    
    await AppDataSource.runMigrations();
    console.log('✅ Migrations executed successfully');
    
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
