-- ============================================
-- WO-002 Seeds: Domain Owners & Release Gates
-- ============================================

-- Insert domain owners
INSERT INTO domain_owners (id, name, domain, role, contact_email, is_active, created_at, updated_at)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Platform Engineering', 'platform.delivery-enterprise.com', 'technical', 'platform@delivery-enterprise.com', 1, datetime('now'), datetime('now')),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Security Team', 'security.delivery-enterprise.com', 'security', 'security@delivery-enterprise.com', 1, datetime('now'), datetime('now')),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Business Operations', 'ops.delivery-enterprise.com', 'business', 'ops@delivery-enterprise.com', 1, datetime('now'), datetime('now')),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Compliance Office', 'compliance.delivery-enterprise.com', 'compliance', 'compliance@delivery-enterprise.com', 1, datetime('now'), datetime('now'));

-- Insert release gates
INSERT INTO release_gates (id, name, type, status, description, version, target_environment, owner_id, requires_approval, rollback_instructions, created_at, updated_at)
VALUES
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'Payment Gateway v2.0', 'feature_flag', 'approved', 'New payment processor integration', '2.0.0', 'production', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1, 'Disable PAYMENT_GATEWAY_V2 flag', datetime('now'), datetime('now')),
  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'Route Optimization ML', 'deployment', 'pending', 'New route optimization algorithm', '3.1.0', 'staging', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1, 'Rollback to ML model v3.0', datetime('now'), datetime('now')),
  ('a7b8c9d0-e1f2-3456-abcd-567890123456', 'GDPR Consent Banner', 'config_change', 'approved', 'Updated GDPR consent flow', '1.0.0', 'eu-production', 'd4e5f6a7-b8c9-0123-defa-234567890123', 1, 'Revert GDPR_CONFIG version', datetime('now'), datetime('now')),
  ('b8c9d0e1-f2a3-4567-bcde-678901234567', 'Driver KYC Verification', 'migration', 'pending', 'Enhanced identity verification', '2.0.0', 'production', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 1, 'Restore from backup: driver_kyc table', datetime('now'), datetime('now'));
