import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class GovernanceIntegrationTables1700000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- GOVERNANCE ---
    await queryRunner.createTable(new Table({
      name: 'governance_policies',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'policyName', type: 'varchar', length: '255' },
        { name: 'description', type: 'text', isNullable: true },
        { name: 'type', type: 'varchar', length: '50' },
        { name: 'jurisdiction', type: 'varchar', length: '100' },
        { name: 'version', type: 'varchar', length: '50' },
        { name: 'effectiveDate', type: 'date' },
        { name: 'expiryDate', type: 'date', isNullable: true },
        { name: 'documentPath', type: 'varchar', length: '1000', isNullable: true },
        { name: 'approvalStatus', type: 'varchar', length: '50', default: "'draft'" },
        { name: 'approvedBy', type: 'varchar', length: '255', isNullable: true },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'metadata', type: 'jsonb', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'compliance_records',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'policyId', type: 'uuid' },
        { name: 'entityType', type: 'varchar', length: '100' },
        { name: 'entityId', type: 'uuid' },
        { name: 'status', type: 'varchar', length: '50', default: "'pending_review'" },
        { name: 'assessmentDate', type: 'date' },
        { name: 'nextReviewDate', type: 'date', isNullable: true },
        { name: 'auditorId', type: 'uuid', isNullable: true },
        { name: 'findings', type: 'jsonb', isNullable: true },
        { name: 'remediationPlan', type: 'jsonb', isNullable: true },
        { name: 'comments', type: 'text', isNullable: true },
        { name: 'isCritical', type: 'boolean', default: false },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createIndex('governance_policies', new TableIndex({ name: 'idx_gov_policies_type_jurisdiction', columnNames: ['type', 'jurisdiction'] }));
    await queryRunner.createIndex('compliance_records', new TableIndex({ name: 'idx_compliance_entity', columnNames: ['entityType', 'entityId'] }));
    await queryRunner.createIndex('compliance_records', new TableIndex({ name: 'idx_compliance_policy', columnNames: ['policyId'] }));

    await queryRunner.createForeignKey('compliance_records', new TableForeignKey({
      columnNames: ['policyId'],
      referencedTableName: 'governance_policies',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));

    // --- INTEGRATION GATEWAY ---
    await queryRunner.createTable(new Table({
      name: 'api_keys',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'keyHash', type: 'varchar', length: '255', isUnique: true },
        { name: 'keyPrefix', type: 'varchar', length: '16' },
        { name: 'userId', type: 'uuid' },
        { name: 'name', type: 'varchar', length: '100' },
        { name: 'permissions', type: 'jsonb' },
        { name: 'allowedOrigins', type: 'jsonb', isNullable: true },
        { name: 'rateLimit', type: 'int', default: 1000 },
        { name: 'expiresAt', type: 'timestamp with time zone', isNullable: true },
        { name: 'lastUsedAt', type: 'timestamp with time zone', isNullable: true },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'external_services',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'serviceProvider', type: 'varchar', length: '100' },
        { name: 'serviceName', type: 'varchar', length: '255' },
        { name: 'apiKey', type: 'text', isNullable: true },
        { name: 'apiSecret', type: 'text', isNullable: true },
        { name: 'baseUrl', type: 'varchar', length: '500' },
        { name: 'authType', type: 'varchar', length: '50', default: "'api_key'" },
        { name: 'webhookUrl', type: 'varchar', length: '500', isNullable: true },
        { name: 'isConfigured', type: 'boolean', default: false },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'metadata', type: 'jsonb', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'webhooks',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'endpointUrl', type: 'varchar', length: '500' },
        { name: 'events', type: 'varchar', isArray: true },
        { name: 'secret', type: 'varchar', length: '255', isNullable: true },
        { name: 'httpMethod', type: 'varchar', length: '10', default: "'POST'" },
        { name: 'headers', type: 'jsonb', isNullable: true },
        { name: 'retryAttempts', type: 'int', default: 3 },
        { name: 'timeoutMs', type: 'int', default: 5000 },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'successCount', type: 'bigint', default: 0 },
        { name: 'failureCount', type: 'bigint', default: 0 },
        { name: 'lastTriggeredAt', type: 'timestamp with time zone', isNullable: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'rate_limit_configs',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
        { name: 'identifier', type: 'varchar', length: '255' },
        { name: 'identifierType', type: 'varchar', length: '50', default: "'ip'" },
        { name: 'requestsPerSecond', type: 'int', default: 10 },
        { name: 'burstLimit', type: 'int', default: 50 },
        { name: 'windowSeconds', type: 'int', default: 60 },
        { name: 'maxRequestsInWindow', type: 'int', default: 1000 },
        { name: 'scope', type: 'varchar', length: '100', default: "'global'" },
        { name: 'bypassList', type: 'jsonb', isNullable: true },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'createdAt', type: 'timestamp with time zone' },
        { name: 'updatedAt', type: 'timestamp with time zone' },
        { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
      ],
    }), true);

    await queryRunner.createIndex('api_keys', new TableIndex({ name: 'idx_api_keys_user', columnNames: ['userId'] }));
    await queryRunner.createIndex('api_keys', new TableIndex({ name: 'idx_api_keys_active', columnNames: ['isActive'] }));
    await queryRunner.createIndex('external_services', new TableIndex({ name: 'idx_external_services_provider', columnNames: ['serviceProvider'] }));
    await queryRunner.createIndex('webhooks', new TableIndex({ name: 'idx_webhooks_active', columnNames: ['isActive'] }));
    await queryRunner.createIndex('rate_limit_configs', new TableIndex({ name: 'idx_rate_limit_identifier', columnNames: ['identifier', 'identifierType'] }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('rate_limit_configs');
    await queryRunner.dropTable('webhooks');
    await queryRunner.dropTable('external_services');
    await queryRunner.dropTable('api_keys');
    await queryRunner.dropTable('compliance_records');
    await queryRunner.dropTable('governance_policies');
  }
}
