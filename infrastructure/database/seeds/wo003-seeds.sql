-- ============================================
-- WO-003 Seeds: Damage Records, Risks, Exceptions
-- ============================================

-- Damage Records
INSERT INTO damage_records (id, title, description, damage_type, severity, status, reported_by, affected_entity_type, impact_description, created_at, updated_at)
VALUES
  ('dmg-001-uuid-a1b2c3d4e5f6', 'Data breach - customer PII exposed', 'Unauthorized access to customer database exposed 5000 PII records', 'data', 'critical', 'confirmed', 'admin-uuid', 'CustomerDatabase', '5000 records exposed, regulatory notification required', datetime('now'), datetime('now')),
  ('dmg-002-uuid-b2c3d4e5f6a7', 'Payment gateway downtime', 'Stripe integration was down for 2 hours causing lost transactions', 'financial', 'high', 'resolved', 'admin-uuid', 'PaymentService', '$15,000 in lost transactions', datetime('now', '-2 days'), datetime('now')),
  ('dmg-003-uuid-c3d4e5f6a7b8', 'Courier vehicle accident', 'Delivery courier involved in traffic accident', 'physical', 'medium', 'investigating', 'admin-uuid', 'Courier', 'Vehicle damaged, minor injuries', datetime('now', '-1 day'), datetime('now'));

-- Risk Assessments
INSERT INTO risk_assessments (id, title, description, risk_category, risk_level, status, mitigation_plan, contingency_plan, likelihood, impact, created_at, updated_at, next_review_date)
VALUES
  ('risk-001-uuid-d4e5f6a7b8c9', 'AI bias in delivery route assignment', 'ML model may assign routes with demographic bias', 'systemic', 'high', 'assessed', 'Regular bias audits, diverse training data', 'Manual override capability, human review weekly', 'medium', 'high', datetime('now'), datetime('now'), datetime('now', '+30 days')),
  ('risk-002-uuid-e5f6a7b8c9d0', 'Third-party API dependency', 'Critical dependency on Stripe and Twilio', 'operational', 'medium', 'mitigated', 'Multi-provider fallback, circuit breaker pattern', 'Graceful degradation, cached data', 'medium', 'medium', datetime('now'), datetime('now'), datetime('now', '+60 days')),
  ('risk-003-uuid-f6a7b8c9d0e1', 'GDPR non-compliance penalty', 'Potential fines for data handling violations', 'compliance', 'critical', 'escalated', 'DPO review, automated consent management', 'Legal counsel retained, insurance coverage', 'low', 'critical', datetime('now'), datetime('now'), datetime('now', '+15 days'));

-- Exception Records
INSERT INTO exception_records (id, title, description, exception_type, status, justification, policy_reference, requested_by, conditions, expires_at, created_at, updated_at)
VALUES
  ('exc-001-uuid-a7b8c9d0e1f2', 'Emergency admin access override', 'Production database access needed for incident response outside business hours', 'access_override', 'approved', 'Critical P0 incident requiring immediate database intervention', 'SEC-POL-007: Production Access Control', 'admin-uuid-1', 'Must log all actions, notify security team within 1 hour', datetime('now', '+1 day'), datetime('now'), datetime('now')),
  ('exc-002-uuid-b8c9d0e1f2a3', 'Payment processing without KYC', 'Temporary waiver for trusted merchants during KYC system outage', 'compliance_waiver', 'denied', 'KYC verification system down, merchants unable to process payments', 'COMP-POL-003: KYC Requirements', 'admin-uuid-2', NULL, datetime('now', '+7 days'), datetime('now'), datetime('now')),
  ('exc-003-uuid-c9d0e1f2a3b4', 'Skip automated testing for hotfix', 'Critical security patch needs deployment before full test cycle', 'process_deviation', 'approved', 'Zero-day vulnerability requiring immediate patch', 'DEV-POL-012: CI/CD Pipeline Requirements', 'admin-uuid-1', 'Must run full regression within 24 hours post-deploy', datetime('now', '+2 days'), datetime('now'), datetime('now'));
