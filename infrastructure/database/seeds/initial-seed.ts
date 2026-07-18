import { DataSource } from 'typeorm';

export async function runInitialSeed(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // === 1. Seed Feature Flags ===
    const flagExists = await queryRunner.query(
      `SELECT COUNT(*) as count FROM feature_flags WHERE flag_key = ?`,
      ['enable_notifications'],
    );

    if (Number(flagExists[0].count) === 0) {
      await queryRunner.query(
        `INSERT INTO feature_flags (id, flag_key, flag_name, description, strategy, status, default_value, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          'enable_notifications',
          'Enable Notifications',
          'Master flag to enable/disable notification system',
          'BOOLEAN',
          'ENABLED',
          1,
          'system-seed',
        ],
      );
      console.log('✅ Feature flag: enable_notifications');
    }

    const flag2Exists = await queryRunner.query(
      `SELECT COUNT(*) as count FROM feature_flags WHERE flag_key = ?`,
      ['enable_ml_predictions'],
    );

    if (Number(flag2Exists[0].count) === 0) {
      await queryRunner.query(
        `INSERT INTO feature_flags (id, flag_key, flag_name, description, strategy, status, default_value, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          'enable_ml_predictions',
          'Enable ML Predictions',
          'Toggle machine learning prediction pipeline',
          'PERCENTAGE',
          'DISABLED',
          0,
          'system-seed',
        ],
      );
      console.log('✅ Feature flag: enable_ml_predictions');
    }

    // === 2. Seed Governance Policies ===
    const policyExists = await queryRunner.query(
      `SELECT COUNT(*) as count FROM governance_policies WHERE "policyName" = ?`,
      ['Default Privacy Policy'],
    );

    if (Number(policyExists[0].count) === 0) {
      await queryRunner.query(
        `INSERT INTO governance_policies ("id", "policyName", "description", "type", "jurisdiction", "version", "effectiveDate", "approvalStatus", "isActive") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          'Default Privacy Policy',
          'Base privacy policy governing data handling across the platform',
          'privacy',
          'global',
          '1.0.0',
          '2025-01-01',
          'approved',
          1,
        ],
      );
      console.log('✅ Governance: Default Privacy Policy');
    }

    // === 3. Seed Chat Rooms ===
    const roomExists = await queryRunner.query(
      `SELECT COUNT(*) as count FROM chat_rooms WHERE "roomName" = ?`,
      ['general'],
    );

    if (Number(roomExists[0].count) === 0) {
      await queryRunner.query(
        `INSERT INTO chat_rooms ("id", "roomName", "type", "createdByUserId", "participantIds", "isActive") VALUES (?, ?, ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          'general',
          'group',
          'system-seed',
          '[]',
          1,
        ],
      );
      console.log('✅ Chat: general room');
    }

    // === 4. Seed Wellness Goals ===
    const goalExists = await queryRunner.query(
      `SELECT COUNT(*) as count FROM wellness_goals WHERE "goalName" = ?`,
      ['Daily Steps Goal'],
    );

    if (Number(goalExists[0].count) === 0) {
      await queryRunner.query(
        `INSERT INTO wellness_goals ("id", "userId", "goalName", "description", "type", "targetValue", "unit", "frequency", "startDate", "currentValue", "isActive") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          'system-seed',
          'Daily Steps Goal',
          'Walk 10,000 steps every day',
          'physical',
          10000,
          'steps',
          'daily',
          '2025-01-01',
          0,
          1,
        ],
      );
      console.log('✅ Wellness: Daily Steps Goal');
    }

    // === 5. Seed Configurations ===
    const configExists = await queryRunner.query(
      `SELECT COUNT(*) as count FROM configurations WHERE "configKey" = ?`,
      ['platform_version'],
    );

    if (Number(configExists[0].count) === 0) {
      await queryRunner.query(
        `INSERT INTO configurations ("id", "configKey", "configName", "configType", "scope", "value", "description", "modifiedByUserId") VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          'platform_version',
          'Platform Version',
          'string',
          'global',
          '1.0.0',
          'Current platform version',
          'system-seed',
        ],
      );
      console.log('✅ Configuration: platform_version');
    }

    const config2Exists = await queryRunner.query(
      `SELECT COUNT(*) as count FROM configurations WHERE "configKey" = ?`,
      ['max_delivery_radius_km'],
    );

    if (Number(config2Exists[0].count) === 0) {
      await queryRunner.query(
        `INSERT INTO configurations ("id", "configKey", "configName", "configType", "scope", "value", "description", "modifiedByUserId") VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          'max_delivery_radius_km',
          'Max Delivery Radius (km)',
          'number',
          'global',
          '50',
          'Maximum delivery radius in kilometers',
          'system-seed',
        ],
      );
      console.log('✅ Configuration: max_delivery_radius_km');
    }

    await queryRunner.commitTransaction();
    console.log('\n🎉 Seed completado exitosamente!');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error en seed:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}

// Ejecutar directamente si se llama desde CLI
if (require.main === module) {
  const { DataSource } = require('typeorm');
  const dataSource = new DataSource({
    type: 'sqlite',
    database: process.env.DB_PATH || './dev.db',
    entities: ['src/modules/**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: false,
  });
  dataSource.initialize().then(async () => {
    await runInitialSeed(dataSource);
    await dataSource.destroy();
  });
}
