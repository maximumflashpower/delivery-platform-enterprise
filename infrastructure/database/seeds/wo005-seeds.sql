-- ============================================
-- WO-005 Seeds: Privacy Consents and Preferences
-- ============================================

-- Privacy Consents (8 types)
INSERT INTO privacy_consents (id, user_id, consent_type, status, purpose_description, legal_basis, granted_at, expires_at, version, is_active, created_at, updated_at)
VALUES
  ('consent-001-uuid-a1b2c3d4', 'user-uuid-001', 'data_processing', 'granted', 'Essential service delivery and account management', 'contract_necessity', datetime('now'), datetime('now', '+2 years'), '2.0', 1, datetime('now'), datetime('now')),
  ('consent-002-uuid-b2c3d4e5', 'user-uuid-001', 'marketing', 'granted', 'Marketing emails about new features and promotions', 'explicit_consent', datetime('now'), datetime('now', '+1 year'), '1.0', 1, datetime('now'), datetime('now')),
  ('consent-003-uuid-c3d4e5f6', 'user-uuid-001', 'analytics', 'granted', 'Usage analytics to improve service quality', 'legitimate_interest', datetime('now'), datetime('now', '+1 year'), '1.0', 1, datetime('now'), datetime('now')),
  ('consent-004-uuid-d4e5f6a7', 'user-uuid-001', 'third_party_sharing', 'withdrawn', 'Sharing data with partner services', 'explicit_consent', datetime('now', '-30 days'), NULL, '1.0', 0, datetime('now', '-30 days'), datetime('now')),
  ('consent-005-uuid-e5f6a7b8', 'user-uuid-002', 'data_processing', 'granted', 'Essential service delivery and account management', 'contract_necessity', datetime('now'), datetime('now', '+2 years'), '2.0', 1, datetime('now'), datetime('now')),
  ('consent-006-uuid-f6a7b8c9', 'user-uuid-002', 'marketing', 'withdrawn', 'Marketing communications', 'explicit_consent', datetime('now', '-6 months'), datetime('now', '-3 days'), '1.0', 0, datetime('now', '-6 months'), datetime('now')),
  ('consent-007-uuid-a7b8c9d0', 'user-uuid-003', 'biometric', 'granted', 'Face ID authentication for secure login', 'explicit_consent', datetime('now'), datetime('now', '+1 year'), '1.0', 1, datetime('now'), datetime('now')),
  ('consent-008-uuid-b8c9d0e1', 'user-uuid-003', 'location_tracking', 'pending', 'Location-based delivery optimization', 'explicit_consent', NULL, datetime('now', '+1 year'), '1.0', 1, datetime('now'), datetime('now'));

-- Data Processing Records
INSERT INTO data_processing_records (id, user_id, processing_purpose, data_category, data_elements, retention_policy, consent_id, processing_started_at, legal_ground, created_at)
VALUES
  ('proc-001-uuid-c9d0e1f2', 'user-uuid-001', 'service_delivery', 'account_data', 'email,name,phone,address', '7 years post-account closure', 'consent-001-uuid-a1b2c3d4', datetime('now'), 'contract_necessity', datetime('now')),
  ('proc-002-uuid-d0e1f2a3', 'user-uuid-001', 'marketing_communication', 'contact_preferences', 'email,preferences', '2 years from last engagement', 'consent-002-uuid-b2c3d4e5', datetime('now'), 'explicit_consent', datetime('now')),
  ('proc-003-uuid-e1f2a3b4', 'user-uuid-002', 'service_delivery', 'account_data', 'email,name,phone', '7 years post-account closure', 'consent-005-uuid-e5f6a7b8', datetime('now'), 'contract_necessity', datetime('now')),
  ('proc-004-uuid-f2a3b4c5', 'user-uuid-003', 'security_fraud', 'authentication_data', 'ip_address,device_fingerprint,bio_data', '90 days', 'consent-007-uuid-a7b8c9d0', datetime('now'), 'legal_obligation', datetime('now'));

-- User Data Requests (DSARs)
INSERT INTO user_data_requests (id, user_id, request_type, status, additional_details, submitted_at, processed_at, processed_by, created_at, updated_at)
VALUES
  ('dsar-001-uuid-a1b2c3d4', 'user-uuid-001', 'access', 'completed', 'Full data export for personal records', datetime('now', '-10 days'), datetime('now', '-8 days'), 'admin-uuid-1', datetime('now', '-10 days'), datetime('now', '-8 days')),
  ('dsar-002-uuid-b2c3d4e5', 'user-uuid-002', 'erasure', 'in_progress', 'Delete my account and all data', datetime('now', '-5 days'), datetime('now', '-3 days'), 'admin-uuid-2', datetime('now', '-5 days'), datetime('now', '-3 days')),
  ('dsar-003-uuid-c3d4e5f6', 'user-uuid-001', 'portability', 'completed', 'Export data in JSON format for migration', datetime('now', '-2 days'), datetime('now'), 'admin-uuid-1', datetime('now', '-2 days'), datetime('now'));

-- Dynamic Preferences
INSERT INTO dynamic_preferences (id, user_id, preference_key, preference_value, scope, category, is_active, created_at, updated_at)
VALUES
  ('pref-001-uuid-d4e5f6a7', 'user-uuid-001', 'language', 'en-US', 'global', 'localization', 1, datetime('now'), datetime('now')),
  ('pref-002-uuid-e5f6a7b8', 'user-uuid-001', 'timezone', 'America/New_York', 'global', 'localization', 1, datetime('now'), datetime('now')),
  ('pref-003-uuid-f6a7b8c9', 'user-uuid-001', 'notification_email', 'true', 'communication', 'notifications', 1, datetime('now'), datetime('now')),
  ('pref-004-uuid-a7b8c9d0', 'user-uuid-001', 'notification_push', 'false', 'communication', 'notifications', 1, datetime('now'), datetime('now')),
  ('pref-005-uuid-b8c9d0e1', 'user-uuid-002', 'language', 'es-ES', 'global', 'localization', 1, datetime('now'), datetime('now')),
  ('pref-006-uuid-c9d0e1f2', 'user-uuid-003', 'theme', 'dark', 'ui', 'appearance', 1, datetime('now'), datetime('now')),
  ('pref-007-uuid-d0e1f2a3', 'user-uuid-003', 'accessibility_high_contrast', 'true', 'ui', 'accessibility', 1, datetime('now'), datetime('now'));
