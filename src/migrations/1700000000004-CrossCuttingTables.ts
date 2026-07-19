import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CrossCuttingTables1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- NOTIFICATION MODULE ---
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'userId', type: 'uuid', isNullable: true },
          { name: 'type', type: 'varchar', length: '50' },
          { name: 'channel', type: 'varchar', length: '20' },
          { name: 'status', type: 'varchar', length: '20', default: "'pending'" },
          { name: 'title', type: 'varchar', length: '255' },
          { name: 'message', type: 'text' },
          { name: 'metadata', type: 'jsonb', isNullable: true },
          { name: 'scheduledAt', type: 'timestamp with time zone', isNullable: true },
          { name: 'sentAt', type: 'timestamp with time zone', isNullable: true },
          { name: 'readAt', type: 'timestamp with time zone', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'notification_templates',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'type', type: 'varchar', length: '50' },
          { name: 'channel', type: 'varchar', length: '20' },
          { name: 'subject', type: 'varchar', length: '255', isNullable: true },
          { name: 'content', type: 'text' },
          { name: 'variables', type: 'jsonb', isNullable: true },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'notification_preferences',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'userId', type: 'uuid' },
          { name: 'channel', type: 'varchar', length: '20' },
          { name: 'type', type: 'varchar', length: '50' },
          { name: 'isEnabled', type: 'boolean', default: true },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'notifications',
      new TableIndex({ name: 'idx_notifications_user_status', columnNames: ['userId', 'status'] }),
    );

    // --- AUDIT-LOG MODULE ---
    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'userId', type: 'uuid', isNullable: true },
          { name: 'action', type: 'varchar', length: '100' },
          { name: 'entityType', type: 'varchar', length: '100' },
          { name: 'entityId', type: 'uuid', isNullable: true },
          { name: 'changes', type: 'jsonb', isNullable: true },
          { name: 'ipAddress', type: 'varchar', length: '45', isNullable: true },
          { name: 'userAgent', type: 'varchar', length: '500', isNullable: true },
          { name: 'timestamp', type: 'timestamp with time zone' },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'audit_events',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'logId', type: 'uuid' },
          { name: 'eventType', type: 'varchar', length: '100' },
          { name: 'details', type: 'jsonb', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({ name: 'idx_audit_logs_user_timestamp', columnNames: ['userId', 'timestamp'] }),
    );

    // --- FILE-STORAGE MODULE ---
    await queryRunner.createTable(
      new Table({
        name: 'stored_files',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'bucketId', type: 'uuid' },
          { name: 'fileName', type: 'varchar', length: '500' },
          { name: 'originalName', type: 'varchar', length: '500' },
          { name: 'fileType', type: 'varchar', length: '50' },
          { name: 'fileSize', type: 'bigint' },
          { name: 'storagePath', type: 'varchar', length: '1000' },
          { name: 'publicUrl', type: 'varchar', length: '1000', isNullable: true },
          { name: 'provider', type: 'varchar', length: '50', default: "'local'" },
          { name: 'status', type: 'varchar', length: '20', default: "'active'" },
          { name: 'uploadedByUserId', type: 'uuid', isNullable: true },
          { name: 'metadata', type: 'jsonb', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'file_buckets',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'provider', type: 'varchar', length: '50' },
          { name: 'pathPrefix', type: 'varchar', length: '500', isNullable: true },
          { name: 'maxFileSize', type: 'bigint', default: 104857600 },
          { name: 'allowedTypes', type: 'jsonb', isNullable: true },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'stored_files',
      new TableIndex({ name: 'idx_stored_files_bucket_status', columnNames: ['bucketId', 'status'] }),
    );

    // --- WEBHOOK MODULE ---
    await queryRunner.createTable(
      new Table({
        name: 'webhook_endpoints',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'endpointName', type: 'varchar', length: '255' },
          { name: 'targetUrl', type: 'varchar', length: '1000' },
          { name: 'subscribedEvents', type: 'jsonb', isNullable: true },
          { name: 'secretToken', type: 'varchar', length: '500', isNullable: true },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'ownerUserId', type: 'uuid' },
          { name: 'retryMaxAttempts', type: 'int', default: 3 },
          { name: 'retryDelaySeconds', type: 'int', default: 60 },
          { name: 'lastTriggeredAt', type: 'timestamp with time zone', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'webhook_events',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'endpointId', type: 'uuid' },
          { name: 'eventType', type: 'varchar', length: '100' },
          { name: 'status', type: 'varchar', length: '20', default: "'pending'" },
          { name: 'payload', type: 'jsonb', isNullable: true },
          { name: 'attemptCount', type: 'int', default: 0 },
          { name: 'maxAttempts', type: 'int', default: 3 },
          { name: 'nextRetryAt', type: 'timestamp with time zone', isNullable: true },
          { name: 'triggeredAt', type: 'timestamp with time zone' },
          { name: 'sentAt', type: 'timestamp with time zone', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'webhook_deliveries',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'eventId', type: 'uuid' },
          { name: 'endpointId', type: 'uuid' },
          { name: 'requestMethod', type: 'varchar', length: '10', default: "'POST'" },
          { name: 'requestUrl', type: 'varchar', length: '1000' },
          { name: 'requestHeaders', type: 'jsonb', isNullable: true },
          { name: 'requestBody', type: 'jsonb', isNullable: true },
          { name: 'responseStatusCode', type: 'int', isNullable: true },
          { name: 'responseHeaders', type: 'jsonb', isNullable: true },
          { name: 'responseBody', type: 'text', isNullable: true },
          { name: 'durationMs', type: 'int', isNullable: true },
          { name: 'isSuccess', type: 'boolean', default: false },
          { name: 'errorMessage', type: 'text', isNullable: true },
          { name: 'attemptNumber', type: 'int' },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    // --- FEATURE-FLAG MODULE ---
    await queryRunner.createTable(
      new Table({
        name: 'feature_flags',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'flagName', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'strategy', type: 'varchar', length: '50', default: "'simple'" },
          { name: 'status', type: 'varchar', length: '20', default: "'disabled'" },
          { name: 'rolloutPercentage', type: 'int', default: 0 },
          { name: 'createdByUserId', type: 'uuid', isNullable: true },
          { name: 'environment', type: 'varchar', length: '50', default: "'production'" },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'feature_flag_rollouts',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'flagId', type: 'uuid' },
          { name: 'segmentType', type: 'varchar', length: '50' },
          { name: 'segmentValue', type: 'varchar', length: '500' },
          { name: 'percentage', type: 'int', default: 0 },
          { name: 'priority', type: 'int', default: 0 },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'feature_flags',
      new TableIndex({ name: 'idx_feature_flags_name_environment', columnNames: ['flagName', 'environment'] }),
    );

    // --- CONFIGURATION MODULE ---
    await queryRunner.createTable(
      new Table({
        name: 'configurations',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'key', type: 'varchar', length: '255' },
          { name: 'value', type: 'jsonb' },
          { name: 'scope', type: 'varchar', length: '50', default: "'global'" },
          { name: 'configType', type: 'varchar', length: '50' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'version', type: 'int', default: 1 },
          { name: 'lastModifiedByUserId', type: 'uuid', isNullable: true },
          { name: 'environment', type: 'varchar', length: '50', default: "'production'" },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'configuration_history',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'configurationId', type: 'uuid' },
          { name: 'oldValue', type: 'jsonb', isNullable: true },
          { name: 'newValue', type: 'jsonb' },
          { name: 'changedByUserId', type: 'uuid' },
          { name: 'changeReason', type: 'text', isNullable: true },
          { name: 'version', type: 'int' },
          { name: 'changedAt', type: 'timestamp with time zone' },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'configurations',
      new TableIndex({ name: 'idx_configurations_key_scope', columnNames: ['key', 'scope'] }),
    );

    // --- ANALYTICS MODULE ---
    await queryRunner.createTable(
      new Table({
        name: 'analytics_events',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'userId', type: 'uuid', isNullable: true },
          { name: 'sessionId', type: 'varchar', length: '255', isNullable: true },
          { name: 'category', type: 'varchar', length: '50' },
          { name: 'eventName', type: 'varchar', length: '255' },
          { name: 'properties', type: 'jsonb', isNullable: true },
          { name: 'deviceType', type: 'varchar', length: '50', isNullable: true },
          { name: 'platform', type: 'varchar', length: '50', isNullable: true },
          { name: 'ipAddress', type: 'varchar', length: '45', isNullable: true },
          { name: 'userAgent', type: 'varchar', length: '500', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'analytics_reports',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'reportName', type: 'varchar', length: '255' },
          { name: 'reportType', type: 'varchar', length: '100' },
          { name: 'startDate', type: 'timestamp with time zone' },
          { name: 'endDate', type: 'timestamp with time zone' },
          { name: 'metrics', type: 'jsonb' },
          { name: 'breakdownDimensions', type: 'jsonb', isNullable: true },
          { name: 'generatedByUserId', type: 'uuid' },
          { name: 'filters', type: 'jsonb', isNullable: true },
          { name: 'outputPath', type: 'varchar', length: '500', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'analytics_events',
      new TableIndex({ name: 'idx_analytics_events_category_timestamp', columnNames: ['category', 'createdAt'] }),
    );

    // --- RATE-LIMIT MODULE ---
    await queryRunner.createTable(
      new Table({
        name: 'rate_limit_policies',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'policyName', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'maxRequests', type: 'int' },
          { name: 'windowDuration', type: 'int' },
          { name: 'windowUnit', type: 'varchar', length: '20' },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'ownerUserId', type: 'uuid', isNullable: true },
          { name: 'appliesTo', type: 'varchar', length: '100', isNullable: true },
          { name: 'scope', type: 'varchar', length: '50', default: "'global'" },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'rate_limit_buckets',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'policyId', type: 'uuid' },
          { name: 'identifier', type: 'varchar', length: '255' },
          { name: 'currentCount', type: 'int', default: 0 },
          { name: 'resetAt', type: 'timestamp with time zone' },
          { name: 'unit', type: 'varchar', length: '20' },
          { name: 'maxRequests', type: 'int' },
          { name: 'windowDuration', type: 'int' },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'rate_limit_policies',
      new TableIndex({ name: 'idx_rate_limit_policies_name', columnNames: ['policyName'], isUnique: true }),
    );

    // --- I18N MODULE ---
    await queryRunner.createTable(
      new Table({
        name: 'languages',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'code', type: 'varchar', length: '10' },
          { name: 'displayName', type: 'varchar', length: '100' },
          { name: 'nativeName', type: 'varchar', length: '100' },
          { name: 'direction', type: 'varchar', length: '10', default: "'ltr'" },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'isDefault', type: 'boolean', default: false },
          { name: 'regionCode', type: 'varchar', length: '10', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'translation_keys',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'namespace', type: 'varchar', length: '100' },
          { name: 'key', type: 'varchar', length: '500' },
          { name: 'defaultValue', type: 'text', isNullable: true },
          { name: 'category', type: 'varchar', length: '100', isNullable: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'variables', type: 'jsonb', isNullable: true },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'version', type: 'int', default: 1 },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'translations',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'translationKeyId', type: 'uuid' },
          { name: 'languageId', type: 'uuid' },
          { name: 'value', type: 'text' },
          { name: 'status', type: 'varchar', length: '20', default: "'pending'" },
          { name: 'reviewedByUserId', type: 'uuid', isNullable: true },
          { name: 'reviewedAt', type: 'timestamp with time zone', isNullable: true },
          { name: 'version', type: 'int', default: 1 },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone' },
          { name: 'updatedAt', type: 'timestamp with time zone' },
          { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'translation_keys',
      new TableIndex({ name: 'idx_translation_keys_namespace_key', columnNames: ['namespace', 'key'] }),
    );

    await queryRunner.createIndex(
      'translations',
      new TableIndex({ name: 'idx_translations_key_language', columnNames: ['translationKeyId', 'languageId'] }),
    );

    await queryRunner.createIndex(
      'languages',
      new TableIndex({ name: 'idx_languages_code', columnNames: ['code'], isUnique: true }),
    );

    // Foreign Keys
    await queryRunner.createForeignKey(
      'stored_files',
      new TableForeignKey({
        columnNames: ['bucketId'],
        referencedTableName: 'file_buckets',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'audit_events',
      new TableForeignKey({
        columnNames: ['logId'],
        referencedTableName: 'audit_logs',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'webhook_events',
      new TableForeignKey({
        columnNames: ['endpointId'],
        referencedTableName: 'webhook_endpoints',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'webhook_deliveries',
      new TableForeignKey({
        columnNames: ['eventId', 'endpointId'],
        referencedTableName: 'webhook_events',
        referencedColumnNames: ['id', 'endpointId'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'feature_flag_rollouts',
      new TableForeignKey({
        columnNames: ['flagId'],
        referencedTableName: 'feature_flags',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'configuration_history',
      new TableForeignKey({
        columnNames: ['configurationId'],
        referencedTableName: 'configurations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'rate_limit_buckets',
      new TableForeignKey({
        columnNames: ['policyId'],
        referencedTableName: 'rate_limit_policies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'translations',
      new TableForeignKey({
        columnNames: ['translationKeyId'],
        referencedTableName: 'translation_keys',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'translations',
      new TableForeignKey({
        columnNames: ['languageId'],
        referencedTableName: 'languages',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order to satisfy foreign key constraints
    await queryRunner.dropTable('translations');
    await queryRunner.dropTable('translation_keys');
    await queryRunner.dropTable('languages');
    await queryRunner.dropTable('rate_limit_buckets');
    await queryRunner.dropTable('rate_limit_policies');
    await queryRunner.dropTable('analytics_reports');
    await queryRunner.dropTable('analytics_events');
    await queryRunner.dropTable('configuration_history');
    await queryRunner.dropTable('configurations');
    await queryRunner.dropTable('feature_flag_rollouts');
    await queryRunner.dropTable('feature_flags');
    await queryRunner.dropTable('webhook_deliveries');
    await queryRunner.dropTable('webhook_events');
    await queryRunner.dropTable('webhook_endpoints');
    await queryRunner.dropTable('stored_files');
    await queryRunner.dropTable('file_buckets');
    await queryRunner.dropTable('audit_events');
    await queryRunner.dropTable('audit_logs');
    await queryRunner.dropTable('notification_preferences');
    await queryRunner.dropTable('notification_templates');
    await queryRunner.dropTable('notifications');
  }
}
