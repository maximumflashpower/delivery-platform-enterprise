import { DataSource } from 'typeorm';

export async function seedAuditLogs(dataSource: DataSource): Promise<void> {
  const logs = [
    {
      action: 'SYSTEM_STARTUP',
      entityType: 'SYSTEM',
      entityId: 'app-server-001',
      userId: null,
      details: 'Application server started successfully',
      ipAddress: '127.0.0.1',
    },
    {
      action: 'USER_LOGIN',
      entityType: 'USER',
      entityId: 'admin@delivery.com',
      userId: 'system',
      details: 'Successful login from IP 192.168.1.100',
      ipAddress: '192.168.1.100',
    },
    {
      action: 'DATA_EXPORT',
      entityType: 'POLICY',
      entityId: 'policy-privacy-001',
      userId: 'admin@delivery.com',
      details: 'Exported privacy policy configuration',
      ipAddress: '192.168.1.100',
    },
    {
      action: 'SETTINGS_UPDATE',
      entityType: 'CONFIGURATION',
      entityId: 'rate-limiting',
      userId: 'admin@delivery.com',
      details: 'Updated rate limit thresholds from 100 to 150 req/min',
      ipAddress: '192.168.1.100',
    },
    {
      action: 'MODEL_DEPLOYMENT',
      entityType: 'ML_MODEL',
      entityId: 'fraud-detection-v3',
      userId: 'ml-engineer@delivery.com',
      details: 'Deployed fraud detection model v3.1.2 to production',
      ipAddress: '192.168.1.50',
    },
  ];

  const result = await dataSource.manager.query(`
    INSERT INTO audit_logs (action, "entityType", "entityId", "userId", details, "ipAddress", "createdAt")
    VALUES ${logs.map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6}, NOW())`).join(',')}
    RETURNING id, action;
  `, logs.flatMap(l => [l.action, l.entityType, l.entityId, l.userId, l.details, l.ipAddress]));

  console.log(`   Created ${result.length} audit log entries`);
}
