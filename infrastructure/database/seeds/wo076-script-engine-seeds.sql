-- WO-076: Script Engine Seeds

INSERT INTO script_scripts (id, "name", "description", "sourceCode", "language", "status", "version", "createdByUserId", "isEnabled", "timeoutSeconds", "maxConcurrency") VALUES
('s1b2c3d4-0001-4000-8000-000000000001', 'Order Processing Script', 'Automates order validation and fulfillment workflow', 'function processOrder(order) {\n  if (!order.isValid()) {\n    throw new Error(\"Invalid order\");\n  }\n  return fulfill(order);\n}', 'javascript', 'active', 1, 'a1b2c3d4-0001-4000-8000-000000000001', true, 30, 100),
('s1b2c3d4-0002-4000-8000-000000000002', 'Notification Sender', 'Sends notifications via configured channels', 'function sendNotification(user, message, channel) {\n  const client = getClient(channel);\n  return client.send(user, message);\n}', 'javascript', 'active', 2, 'a1b2c3d4-0001-4000-8000-000000000001', true, 15, 200),
('s1b2c3d4-0003-0000-8000-000000000003', 'Data Export Script', 'Exports data to CSV/JSON formats', 'function exportData(query, format) {\n  const data = db.query(query);\n  return convert(data, format);\n}', 'typescript', 'draft', 1, 'a1b2c3d4-0001-4000-8000-000000000001', false, 60, 10);

INSERT INTO script_executions (id, "scriptId", "triggeredByUserId", "triggerType", "status", "inputParameters", "outputResult", "errorMessage", "executionTimeMs", "startedAt", "completedAt", "createdAt") VALUES
('e1b2c3d4-0001-4000-8000-000000000001', 's1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'manual', 'completed', '{"orderId":"o001"}', '{"success":true,"message":"Order fulfilled"}', NULL, 245, datetime('now','-5 minutes'), datetime('now','-5 minutes'), datetime('now','-5 minutes')),
('e1b2c3d4-0002-4000-8000-000000000002', 's1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0002-4000-8000-000000000002', 'scheduled', 'completed', '{"orderId":"o002"}', '{"success":true,"message":"Order fulfilled"}', NULL, 312, datetime('now','-10 minutes'), datetime('now','-10 minutes'), datetime('now','-10 minutes')),
('e1b2c3d4-0003-4000-8000-000000000003', 's1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000001', 'webhook', 'failed', '{"userId":"u001","channel":"email"}', NULL, "Email service unavailable", 15, datetime('now','-1 hour'), NULL, datetime('now','-1 hour'));

INSERT INTO script_templates (id, "scriptId", "name", "configuration", "environment", "isActive", "concurrencyLimit", "timeoutSeconds", "createdAt", "updatedAt") VALUES
('t1b2c3d4-0001-4000-8000-000000000001', 's1b2c3d4-0001-4000-8000-000000000001', 'Production Order Processor', '{"batchSize":100,"retryAttempts":3,"notifyOnError":true}', 'secure', true, 10, 30, datetime('now'), datetime('now')),
('t1b2c3d4-0002-4000-8000-000000000002', 's1b2c3d4-0002-4000-8000-000000000002', 'Weekly Newsletter', '{"channels":["email","push"],"schedule":"weekly","audience":"all"}', 'standard', true, 1, 60, datetime('now'), datetime('now'));

INSERT INTO script_variables (id, "scriptId", "variableName", "dataType", "value", "description", "isSecret", "isRequired", "validationRule", "createdAt") VALUES
('v1b2c3d4-0001-4000-8000-000000000001', 's1b2c3d4-0001-4000-8000-000000000001', 'API_KEY', 'string', 'prod_sk_live_xxx', 'Payment gateway API key', true, true, '^sk_[a-zA-Z0-9]{24}$', datetime('now')),
('v1b2c3d4-0002-4000-8000-000000000002', 's1b2c3d4-0001-4000-8000-000000000001', 'WEBHOOK_URL', 'string', 'https://api.example.com/webhook', 'Webhook notification URL', false, true, '^https://.*$', datetime('now')),
('v1b2c3d4-0003-0000-8000-000000000003', 's1b2c3d4-0002-4000-8000-000000000002', 'SMTP_HOST', 'string', 'smtp.mailprovider.com', 'SMTP server hostname', false, true, NULL, datetime('now'));
