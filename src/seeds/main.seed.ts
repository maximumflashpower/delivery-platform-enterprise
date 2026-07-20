import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';
import { seedIdentity } from './modules/identity.seed';
import { seedGovernance } from './modules/governance.seed';
import { seedChat } from './modules/chat.seed';
import { seedWellness } from './modules/wellness.seed';
import { seedMLModels } from './modules/ml-models.seed';
import { seedFeatureFlags } from './modules/feature-flags.seed';
import { seedNotifications } from './modules/notifications.seed';
import { seedAuditLogs } from './modules/audit-logs.seed';
import { seedLanguages } from './modules/languages.seed';

async function runSeeds(): Promise<void> {
  await AppDataSource.initialize();
  console.log('🌱 Database connection established');

  const seeds = [
    { order: 1, name: 'Languages', fn: seedLanguages },
    { order: 2, name: 'Identity Users', fn: seedIdentity },
    { order: 3, name: 'Governance Policies', fn: seedGovernance },
    { order: 4, name: 'Chat Rooms', fn: seedChat },
    { order: 5, name: 'Wellness Goals', fn: seedWellness },
    { order: 6, name: 'ML Models', fn: seedMLModels },
    { order: 7, name: 'Feature Flags', fn: seedFeatureFlags },
    { order: 8, name: 'Notifications Templates', fn: seedNotifications },
    { order: 9, name: 'Audit Logs', fn: seedAuditLogs },
  ];

  for (const seed of seeds.sort((a, b) => a.order - b.order)) {
    try {
      console.log(`\n🌱 Seeding ${seed.name}...`);
      await seed.fn(AppDataSource);
      console.log(`✅ ${seed.name} seeded successfully`);
    } catch (error) {
      console.error(`❌ Failed to seed ${seed.name}:`, error);
    }
  }

  console.log('\n🎉 All seeds completed!');
  process.exit(0);
}

runSeeds().catch(console.error);
