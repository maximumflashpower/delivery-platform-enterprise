import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

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
        `INSERT INTO feature_flags (id, flag_key, strategy, created_by_user_id) VALUES (?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          'enable_notifications',
          'BOOLEAN',
          'system-seed',
        ],
      );
      console.log('✅ Feature flag: enable_notifications');
    }

    // === 2. Seed Governance Policies ===
    const policyExists = await queryRunner.query(
      `SELECT COUNT(*) as count FROM governance_policies WHERE name = ?`,
      ['default_privacy_policy'],
    );

    if (Number(policyExists[0].count) === 0) {
      await queryRunner.query(
        `INSERT INTO governance_policies (id, name, type, status, created_by_user_id) VALUES (?, ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          'default_privacy_policy',
          'PRIVACY',
          'ACTIVE',
          'system-seed',
        ],
      );
      console.log('✅ Governance: default_privacy_policy');
    }

    // === 3. Seed Wellness Goals ===
    const goalExists = await queryRunner.query(
      `SELECT COUNT(*) as count FROM wellness_goals WHERE title = ?`,
      ['daily_steps_goal'],
    );

    if (Number(goalExists[0].count) === 0) {
      await queryRunner.query(
        `INSERT INTO wellness_goals (id, title, description, target_value, goal_type, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          'daily_steps_goal',
          'Meta diaria de 10,000 pasos',
          10000,
          'STEPS',
          'system-seed',
        ],
      );
      console.log('✅ Wellness: daily_steps_goal');
    }

    // === 4. Seed Chat Default Room ===
    const roomExists = await queryRunner.query(
      `SELECT COUNT(*) as count FROM chat_rooms WHERE name = ?`,
      ['general'],
    );

    if (Number(roomExists[0].count) === 0) {
      await queryRunner.query(
        `INSERT INTO chat_rooms (id, name, description, is_private, created_by_user_id) VALUES (?, ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          'general',
          'Canal general de comunicación',
          0,
          'system-seed',
        ],
      );
      console.log('✅ Chat: general room');
    }

    // === 5. Seed Configuration Values ===
    const configExists = await queryRunner.query(
      `SELECT COUNT(*) as count FROM configurations WHERE config_key = ?`,
      ['platform_version'],
    );

    if (Number(configExists[0].count) === 0) {
      await queryRunner.query(
        `INSERT INTO configurations (id, config_key, config_value, description, updated_by_user_id) VALUES (?, ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          'platform_version',
          '1.0.0',
          'Versión actual de la plataforma',
          'system-seed',
        ],
      );
      console.log('✅ Configuration: platform_version');
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
  const { dataSource } = require('../../src/data-source');
  dataSource.initialize().then(async () => {
    await runInitialSeed(dataSource);
    await dataSource.destroy();
  });
}
