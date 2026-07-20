import { AppDataSource } from '../src/config/database.datasource';
import * as fs from 'fs';

async function runSeeds(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('✅ DataSource initialized');
    
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    
    const seedPath = '/tmp/seed-dev.sql';
    if (!fs.existsSync(seedPath)) {
      throw new Error(`Seed file not found at ${seedPath}`);
    }
    
    const seedSQL = fs.readFileSync(seedPath, 'utf-8');
    console.log(`📄 Seed file loaded: ${seedSQL.length} bytes`);
    
    // Parsear múltiples formas de INSERT (con diferentes formatos SQL)
    const insertPattern = /INSERT\s+INTO\s+[^\;]+\;/gis;
    const insertStatements = seedSQL.match(insertPattern) || [];
    
    console.log(`📝 Found ${insertStatements.length} INSERT statements to execute`);
    
    let count = 0;
    let errorCount = 0;
    
    for (const stmt of insertStatements) {
      try {
        await queryRunner.query(stmt);
        count++;
        if (count % 5 === 0) console.log(`   ⬇️  Inserted ${count} records...`);
      } catch (err: any) {
        // Ignorar errores de duplicados
        if (!err.message?.toLowerCase()?.includes('duplicate') && 
            !err.message?.toLowerCase()?.includes('unique constraint')) {
          console.warn(`⚠️  Skipped: ${err.message?.substring(0, 60)}...\n   SQL: ${stmt.substring(0, 50)}...`);
          errorCount++;
        } else {
          // Duplicate - skip silently
          console.log(`   ⏭️  Skipped duplicate`);
        }
      }
    }
    
    await queryRunner.release();
    
    console.log(`✅ Seeds completed! ${count} records inserted, ${errorCount} errors.`);
    await AppDataSource.destroy();
    process.exit(0);
    
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

runSeeds();
