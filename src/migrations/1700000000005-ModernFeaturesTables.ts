import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class ModernFeaturesTables1700000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- ACCESSIBILITY ---
    await queryRunner.createTable(new Table({
      name: 'accessibility_profiles',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'userId', type: 'uuid' },
        { name: 'type', type: 'varchar', length: '50' },
        { name: 'level', type: 'varchar', length: '20', default: "'mild'" },
        { name: 'accommodations', type: 'jsonb', isNullable: true },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'accessibility_settings',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'userId', type: 'uuid' },
        { name: 'settingKey', type: 'varchar', length: '255' },
        { name: 'settingValue', type: 'jsonb' },
        { name: 'isEnabled', type: 'boolean', default: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createIndex('accessibility_profiles', new TableIndex({ name: 'idx_access_profiles_user', columnNames: ['userId'] }));
    await queryRunner.createIndex('accessibility_settings', new TableIndex({ name: 'idx_access_settings_user', columnNames: ['userId'] }));

    // --- BIOMETRIC-SECURITY ---
    await queryRunner.createTable(new Table({
      name: 'biometric_templates',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'userId', type: 'uuid' },
        { name: 'type', type: 'varchar', length: '50' },
        { name: 'templateHash', type: 'varchar', length: '1000' },
        { name: 'deviceId', type: 'varchar', length: '255', isNullable: true },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'lastUsedAt', type: 'timestamp with time zone', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'biometric_verifications',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'userId', type: 'uuid' },
        { name: 'templateId', type: 'uuid', isNullable: true },
        { name: 'type', type: 'varchar', length: '50' },
        { name: 'status', type: 'varchar', length: '20', default: "'pending'" },
        { name: 'confidenceScore', type: 'decimal', precision: 5, scale: 4, isNullable: true },
        { name: 'ipAddress', type: 'varchar', length: '45', isNullable: true },
        { name: 'deviceId', type: 'varchar', length: '255', isNullable: true },
        { name: 'failureReason', type: 'text', isNullable: true },
        { name: 'verifiedAt', type: 'timestamp with time zone', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createIndex('biometric_templates', new TableIndex({ name: 'idx_biometric_templates_user', columnNames: ['userId'] }));
    await queryRunner.createIndex('biometric_verifications', new TableIndex({ name: 'idx_biometric_verifications_user', columnNames: ['userId'] }));

    await queryRunner.createForeignKey('biometric_verifications', new TableForeignKey({
      columnNames: ['templateId'],
      referencedTableName: 'biometric_templates',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL',
    }));

    // --- CARBON-SUSTAINABILITY ---
    await queryRunner.createTable(new Table({
      name: 'carbon_credits',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'creditName', type: 'varchar', length: '255' },
        { name: 'type', type: 'varchar', length: '50' },
        { name: 'co2AmountKg', type: 'decimal', precision: 12, scale: 2 },
        { name: 'pricePerKg', type: 'decimal', precision: 10, scale: 2, isNullable: true },
        { name: 'currency', type: 'varchar', length: '10', default: "'USD'" },
        { name: 'provider', type: 'varchar', length: '255', isNullable: true },
        { name: 'certificationId', type: 'varchar', length: '255', isNullable: true },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'expiryDate', type: 'date', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'sustainability_metrics',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'entityType', type: 'varchar', length: '100' },
        { name: 'entityId', type: 'uuid' },
        { name: 'metricType', type: 'varchar', length: '50' },
        { name: 'metricValue', type: 'decimal', precision: 14, scale: 4 },
        { name: 'unit', type: 'varchar', length: '50' },
        { name: 'recordedAt', type: 'timestamp with time zone' },
        { name: 'metadata', type: 'jsonb', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createIndex('sustainability_metrics', new TableIndex({ name: 'idx_sustainability_entity', columnNames: ['entityType', 'entityId'] }));

    // --- CHAT ---
    await queryRunner.createTable(new Table({
      name: 'chat_rooms',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'roomName', type: 'varchar', length: '255', isNullable: true },
        { name: 'type', type: 'varchar', length: '50' },
        { name: 'createdByUserId', type: 'uuid' },
        { name: 'participantIds', type: 'jsonb' },
        { name: 'lastMessageAt', type: 'timestamp with time zone', isNullable: true },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'metadata', type: 'jsonb', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'chat_messages',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'roomId', type: 'uuid' },
        { name: 'senderId', type: 'uuid' },
        { name: 'content', type: 'text' },
        { name: 'status', type: 'varchar', length: '20', default: "'sent'" },
        { name: 'attachments', type: 'jsonb', isNullable: true },
        { name: 'replyToId', type: 'uuid', isNullable: true },
        { name: 'editedAt', type: 'timestamp with time zone', isNullable: true },
        { name: 'readByUserIds', type: 'jsonb', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createIndex('chat_messages', new TableIndex({ name: 'idx_chat_messages_room', columnNames: ['roomId'] }));
    await queryRunner.createIndex('chat_messages', new TableIndex({ name: 'idx_chat_messages_sender', columnNames: ['senderId'] }));

    await queryRunner.createForeignKey('chat_messages', new TableForeignKey({
      columnNames: ['roomId'],
      referencedTableName: 'chat_rooms',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));

    // --- EXPERIMENTATION ---
    await queryRunner.createTable(new Table({
      name: 'experiments',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'experimentName', type: 'varchar', length: '255' },
        { name: 'description', type: 'text', isNullable: true },
        { name: 'type', type: 'varchar', length: '50' },
        { name: 'status', type: 'varchar', length: '20', default: "'draft'" },
        { name: 'startDate', type: 'timestamp with time zone', isNullable: true },
        { name: 'endDate', type: 'timestamp with time zone', isNullable: true },
        { name: 'createdByUserId', type: 'uuid', isNullable: true },
        { name: 'targetAudience', type: 'jsonb', isNullable: true },
        { name: 'primaryMetric', type: 'varchar', length: '100', isNullable: true },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'experiment_variants',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'experimentId', type: 'uuid' },
        { name: 'variantName', type: 'varchar', length: '100' },
        { name: 'variantKey', type: 'varchar', length: '50' },
        { name: 'trafficPercentage', type: 'int', default: 0 },
        { name: 'configuration', type: 'jsonb', isNullable: true },
        { name: 'conversionRate', type: 'decimal', precision: 5, scale: 4, isNullable: true },
        { name: 'impressions', type: 'bigint', default: 0 },
        { name: 'conversions', type: 'bigint', default: 0 },
        { name: 'isControl', type: 'boolean', default: false },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createForeignKey('experiment_variants', new TableForeignKey({
      columnNames: ['experimentId'],
      referencedTableName: 'experiments',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));

    // --- GAMIFICATION ---
    await queryRunner.createTable(new Table({
      name: 'achievements',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'achievementName', type: 'varchar', length: '255' },
        { name: 'description', type: 'text', isNullable: true },
        { name: 'type', type: 'varchar', length: '50' },
        { name: 'iconUrl', type: 'varchar', length: '500', isNullable: true },
        { name: 'points', type: 'int', default: 10 },
        { name: 'requirement', type: 'jsonb' },
        { name: 'isVisible', type: 'boolean', default: true },
        { name: 'isSecret', type: 'boolean', default: false },
        { name: 'unlockCount', type: 'bigint', default: 0 },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'user_progress',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'userId', type: 'uuid' },
        { name: 'achievementId', type: 'uuid' },
        { name: 'status', type: 'varchar', length: '20', default: "'not_started'" },
        { name: 'progressValue', type: 'int', default: 0 },
        { name: 'progressTarget', type: 'int', isNullable: true },
        { name: 'unlockedAt', type: 'timestamp with time zone', isNullable: true },
        { name: 'earnedPoints', type: 'int', default: 0 },
        { name: 'metadata', type: 'jsonb', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createIndex('user_progress', new TableIndex({ name: 'idx_user_progress_user_achievement', columnNames: ['userId', 'achievementId'] }));

    await queryRunner.createForeignKey('user_progress', new TableForeignKey({
      columnNames: ['achievementId'],
      referencedTableName: 'achievements',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));

    // --- ML-PIPELINE ---
    await queryRunner.createTable(new Table({
      name: 'model_versions',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'modelName', type: 'varchar', length: '255' },
        { name: 'version', type: 'varchar', length: '50' },
        { name: 'versionNumber', type: 'int' },
        { name: 'status', type: 'varchar', length: '20', default: "'training'" },
        { name: 'modelPath', type: 'varchar', length: '1000', isNullable: true },
        { name: 'framework', type: 'varchar', length: '50', isNullable: true },
        { name: 'accuracy', type: 'decimal', precision: 5, scale: 4, isNullable: true },
        { name: 'metrics', type: 'jsonb', isNullable: true },
        { name: 'trainedByUserId', type: 'uuid', isNullable: true },
        { name: 'deployedAt', type: 'timestamp with time zone', isNullable: true },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'prediction_logs',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'modelId', type: 'uuid' },
        { name: 'modelVersion', type: 'varchar', length: '50' },
        { name: 'userId', type: 'uuid', isNullable: true },
        { name: 'inputData', type: 'jsonb' },
        { name: 'predictionResult', type: 'jsonb', isNullable: true },
        { name: 'status', type: 'varchar', length: '20', default: "'pending'" },
        { name: 'confidenceScore', type: 'decimal', precision: 5, scale: 4, isNullable: true },
        { name: 'processingTimeMs', type: 'int', isNullable: true },
        { name: 'error', type: 'text', isNullable: true },
        { name: 'sessionId', type: 'varchar', length: '255', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createIndex('model_versions', new TableIndex({ name: 'idx_model_versions_name', columnNames: ['modelName', 'versionNumber'] }));
    await queryRunner.createIndex('prediction_logs', new TableIndex({ name: 'idx_prediction_logs_model', columnNames: ['modelId'] }));

    await queryRunner.createForeignKey('prediction_logs', new TableForeignKey({
      columnNames: ['modelId'],
      referencedTableName: 'model_versions',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));

    // --- REALTIME ---
    await queryRunner.createTable(new Table({
      name: 'realtime_channels',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'channelName', type: 'varchar', length: '255', isUnique: true },
        { name: 'type', type: 'varchar', length: '50' },
        { name: 'description', type: 'text', isNullable: true },
        { name: 'creatorUserId', type: 'uuid', isNullable: true },
        { name: 'participantCount', type: 'int', default: 0 },
        { name: 'settings', type: 'jsonb', isNullable: true },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'lastActivityAt', type: 'timestamp with time zone', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'realtime_sessions',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'userId', type: 'uuid' },
        { name: 'connectionId', type: 'varchar', length: '255', isUnique: true },
        { name: 'state', type: 'varchar', length: '20', default: "'connected'" },
        { name: 'channelId', type: 'uuid', isNullable: true },
        { name: 'ipAddress', type: 'varchar', length: '45', isNullable: true },
        { name: 'userAgent', type: 'varchar', length: '500', isNullable: true },
        { name: 'lastHeartbeatAt', type: 'timestamp with time zone', isNullable: true },
        { name: 'disconnectedAt', type: 'timestamp with time zone', isNullable: true },
        { name: 'metadata', type: 'jsonb', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createIndex('realtime_sessions', new TableIndex({ name: 'idx_realtime_sessions_user', columnNames: ['userId'] }));
    await queryRunner.createIndex('realtime_sessions', new TableIndex({ name: 'idx_realtime_sessions_channel', columnNames: ['channelId'] }));

    await queryRunner.createForeignKey('realtime_sessions', new TableForeignKey({
      columnNames: ['channelId'],
      referencedTableName: 'realtime_channels',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL',
    }));

    // --- SMART-CONTRACT ---
    await queryRunner.createTable(new Table({
      name: 'smart_contracts',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'contractName', type: 'varchar', length: '255' },
        { name: 'contractAddress', type: 'varchar', length: '255', isUnique: true, isNullable: true },
        { name: 'network', type: 'varchar', length: '50', default: "'ethereum'" },
        { name: 'status', type: 'varchar', length: '20', default: "'draft'" },
        { name: 'bytecode', type: 'text', isNullable: true },
        { name: 'abi', type: 'jsonb', isNullable: true },
        { name: 'creatorUserId', type: 'uuid' },
        { name: 'deployedAt', type: 'timestamp with time zone', isNullable: true },
        { name: 'transactionHash', type: 'varchar', length: '255', isNullable: true },
        { name: 'gasUsed', type: 'bigint', isNullable: true },
        { name: 'metadata', type: 'jsonb', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'contract_executions',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'contractId', type: 'uuid' },
        { name: 'functionName', type: 'varchar', length: '255' },
        { name: 'functionArgs', type: 'jsonb', isNullable: true },
        { name: 'status', type: 'varchar', length: '20', default: "'queued'" },
        { name: 'initiatedByUserId', type: 'uuid' },
        { name: 'transactionHash', type: 'varchar', length: '255', isNullable: true },
        { name: 'blockNumber', type: 'bigint', isNullable: true },
        { name: 'gasUsed', type: 'bigint', isNullable: true },
        { name: 'result', type: 'jsonb', isNullable: true },
        { name: 'error', type: 'text', isNullable: true },
        { name: 'executedAt', type: 'timestamp with time zone', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createIndex('contract_executions', new TableIndex({ name: 'idx_contract_executions_contract', columnNames: ['contractId'] }));

    await queryRunner.createForeignKey('contract_executions', new TableForeignKey({
      columnNames: ['contractId'],
      referencedTableName: 'smart_contracts',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));

    // --- WELLNESS ---
    await queryRunner.createTable(new Table({
      name: 'wellness_goals',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'userId', type: 'uuid' },
        { name: 'goalName', type: 'varchar', length: '255' },
        { name: 'description', type: 'text', isNullable: true },
        { name: 'type', type: 'varchar', length: '50' },
        { name: 'targetValue', type: 'decimal', precision: 10, scale: 2 },
        { name: 'unit', type: 'varchar', length: '50' },
        { name: 'frequency', type: 'varchar', length: '50', isNullable: true },
        { name: 'startDate', type: 'date' },
        { name: 'targetDate', type: 'date', isNullable: true },
        { name: 'currentValue', type: 'decimal', precision: 10, scale: 2, default: 0 },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'isCompleted', type: 'boolean', default: false },
        { name: 'completedAt', type: 'date', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'wellness_activities',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'userId', type: 'uuid' },
        { name: 'goalId', type: 'uuid', isNullable: true },
        { name: 'type', type: 'varchar', length: '50' },
        { name: 'activityName', type: 'varchar', length: '255' },
        { name: 'durationMinutes', type: 'int', isNullable: true },
        { name: 'metricValue', type: 'decimal', precision: 10, scale: 2, isNullable: true },
        { name: 'unit', type: 'varchar', length: '50', isNullable: true },
        { name: 'notes', type: 'text', isNullable: true },
        { name: 'startTime', type: 'timestamp with time zone' },
        { name: 'endTime', type: 'timestamp with time zone', isNullable: true },
        { name: 'metadata', type: 'jsonb', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createIndex('wellness_goals', new TableIndex({ name: 'idx_wellness_goals_user', columnNames: ['userId'] }));
    await queryRunner.createIndex('wellness_activities', new TableIndex({ name: 'idx_wellness_activities_user_goal', columnNames: ['userId', 'goalId'] }));

    await queryRunner.createForeignKey('wellness_activities', new TableForeignKey({
      columnNames: ['goalId'],
      referencedTableName: 'wellness_goals',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL',
    }));

    // --- ANALYTICS-OBSERVABILITY ---
    await queryRunner.createTable(new Table({
      name: 'system_metrics',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'serviceName', type: 'varchar', length: '255' },
        { name: 'instanceId', type: 'varchar', length: '255', isNullable: true },
        { name: 'metricType', type: 'varchar', length: '50' },
        { name: 'metricValue', type: 'decimal', precision: 14, scale: 4 },
        { name: 'unit', type: 'varchar', length: '50', isNullable: true },
        { name: 'labels', type: 'jsonb', isNullable: true },
        { name: 'collectedAt', type: 'timestamp with time zone' },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'alert_rules',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'ruleName', type: 'varchar', length: '255' },
        { name: 'description', type: 'text', isNullable: true },
        { name: 'metricType', type: 'varchar', length: '50' },
        { name: 'condition', type: 'varchar', length: '255' },
        { name: 'threshold', type: 'decimal', precision: 14, scale: 4 },
        { name: 'evaluationInterval', type: 'varchar', length: '50', default: "'1m'" },
        { name: 'severity', type: 'varchar', length: '20', default: "'warning'" },
        { name: 'notificationChannels', type: 'jsonb', isNullable: true },
        { name: 'cooldownPeriod', type: 'varchar', length: '50', default: "'5m'" },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'triggeredCount', type: 'bigint', default: 0 },
        { name: 'lastTriggeredAt', type: 'timestamp with time zone', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createIndex('system_metrics', new TableIndex({ name: 'idx_system_metrics_service_type', columnNames: ['serviceName', 'metricType'] }));
    await queryRunner.createIndex('system_metrics', new TableIndex({ name: 'idx_system_metrics_collected_at', columnNames: ['collectedAt'] }));
    await queryRunner.createIndex('alert_rules', new TableIndex({ name: 'idx_alert_rules_active', columnNames: ['isActive'] }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('alert_rules');
    await queryRunner.dropTable('system_metrics');
    await queryRunner.dropTable('wellness_activities');
    await queryRunner.dropTable('wellness_goals');
    await queryRunner.dropTable('contract_executions');
    await queryRunner.dropTable('smart_contracts');
    await queryRunner.dropTable('realtime_sessions');
    await queryRunner.dropTable('realtime_channels');
    await queryRunner.dropTable('prediction_logs');
    await queryRunner.dropTable('model_versions');
    await queryRunner.dropTable('user_progress');
    await queryRunner.dropTable('achievements');
    await queryRunner.dropTable('experiment_variants');
    await queryRunner.dropTable('experiments');
    await queryRunner.dropTable('chat_messages');
    await queryRunner.dropTable('chat_rooms');
    await queryRunner.dropTable('sustainability_metrics');
    await queryRunner.dropTable('carbon_credits');
    await queryRunner.dropTable('biometric_verifications');
    await queryRunner.dropTable('biometric_templates');
    await queryRunner.dropTable('accessibility_settings');
    await queryRunner.dropTable('accessibility_profiles');
  }
}
