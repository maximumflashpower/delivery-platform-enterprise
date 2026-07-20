-- ============================================
-- DELIVERY PLATFORM - SEED DATA (CORRECTED)
-- ============================================

-- IDENTITY USERS (5 users)
INSERT INTO identity_users (id, "firstName", "lastName", email, "displayName", status, phone, "emailVerifiedAt", "createdAt", "updatedAt")
VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'System', 'Administrator', 'admin@delivery.com', 'System Admin', 'active', '+1-555-0001', datetime('now'), datetime('now'), datetime('now')),
('a1b2c3d4-0002-4000-8000-000000000002', 'John', 'Driver', 'driver@delivery.com', 'John Driver', 'active', '+1-555-0101', datetime('now'), datetime('now'), datetime('now')),
('a1b2c3d4-0003-4000-8000-000000000003', 'Maria', 'Courier', 'courier@delivery.com', 'Maria Courier', 'active', '+1-555-0201', datetime('now'), datetime('now'), datetime('now')),
('a1b2c3d4-0004-4000-8000-000000000004', 'Carlos', 'Merchant', 'merchant@delivery.com', 'Carlos Merchant', 'active', '+1-555-0301', datetime('now'), datetime('now'), datetime('now')),
('a1b2c3d4-0005-4000-8000-000000000005', 'Ana', 'Customer', 'customer@delivery.com', 'Ana Customer', 'active', '+1-555-0401', datetime('now'), datetime('now'), datetime('now'));

-- GOVERNANCE POLICIES (5 policies)
INSERT INTO governance_policies (id, "policyName", description, type, jurisdiction, version, "effectiveDate", "approvalStatus", "isActive", "createdAt", "updatedAt")
VALUES
('b1b2c3d4-0001-4000-8000-000000000001', 'Data Privacy Policy', 'Governs collection, storage, and processing of user personal data in compliance with GDPR and CCPA.', 'privacy', 'GLOBAL', '1.0', '2024-01-01', 'approved', 1, datetime('now'), datetime('now')),
('b1b2c3d4-0002-4000-8000-000000000002', 'Driver Safety Protocol', 'Establishes minimum safety standards for driver onboarding, vehicle inspection, and ongoing compliance monitoring.', 'security', 'US', '2.1', '2024-03-15', 'approved', 1, datetime('now'), datetime('now')),
('b1b2c3d4-0003-4000-8000-000000000003', 'Transaction Fraud Prevention', 'Defines anti-fraud measures for payment processing, chargeback handling, and suspicious activity detection.', 'security', 'GLOBAL', '1.5', '2024-02-01', 'approved', 1, datetime('now'), datetime('now')),
('b1b2c3d4-0004-4000-8000-000000000004', 'Environmental Sustainability', 'Carbon offset requirements, eco-friendly delivery options, and green logistics initiatives.', 'operational', 'GLOBAL', '1.0', '2024-06-01', 'approved', 1, datetime('now'), datetime('now')),
('b1b2c3d4-0005-4000-8000-000000000005', 'Accessibility Standards', 'WCAG 2.1 compliance requirements for digital services and physical accessibility accommodations.', 'compliance', 'US', '2.0', '2024-01-15', 'approved', 1, datetime('now'), datetime('now'));

-- CHAT ROOMS (4 rooms - need createdByUserId and participantIds)
INSERT INTO chat_rooms (id, "roomName", type, "createdByUserId", "participantIds", "isActive", "createdAt", "updatedAt")
VALUES
('c1b2c3d4-0001-4000-8000-000000000001', 'General Discussion', 'broadcast', 'a1b2c3d4-0001-4000-8000-000000000001', '["a1b2c3d4-0001-4000-8000-000000000001","a1b2c3d4-0002-4000-8000-000000000002","a1b2c3d4-0003-4000-8000-000000000003","a1b2c3d4-0004-4000-8000-000000000004","a1b2c3d4-0005-4000-8000-000000000005"]', 1, datetime('now'), datetime('now')),
('c1b2c3d4-0002-4000-8000-000000000002', 'Driver Support', 'group', 'a1b2c3d4-0001-4000-8000-000000000001', '["a1b2c3d4-0001-4000-8000-000000000001","a1b2c3d4-0002-4000-8000-000000000002"]', 1, datetime('now'), datetime('now')),
('c1b2c3d4-0003-4000-8000-000000000003', 'Merchant Partnerships', 'group', 'a1b2c3d4-0001-4000-8000-000000000001', '["a1b2c3d4-0001-4000-8000-000000000001","a1b2c3d4-0004-4000-8000-000000000004"]', 1, datetime('now'), datetime('now')),
('c1b2c3d4-0004-4000-8000-000000000004', 'Customer Feedback', 'broadcast', 'a1b2c3d4-0001-4000-8000-000000000001', '["a1b2c3d4-0001-4000-8000-000000000001","a1b2c3d4-0005-4000-8000-000000000005"]', 1, datetime('now'), datetime('now'));

-- WELLNESS GOALS (6 goals - need userId, targetValue, unit, startDate)
INSERT INTO wellness_goals (id, "userId", "goalName", description, type, "targetValue", unit, frequency, "startDate", "targetDate", "currentValue", "isActive", "createdAt", "updatedAt")
VALUES
('d1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0005-4000-8000-000000000005', 'Physical Activity Challenge', 'Complete 10,000 steps daily for 30 consecutive days', 'physical', 10000, 'steps', 'daily', '2024-07-01', '2024-07-31', 3500, 1, datetime('now'), datetime('now')),
('d1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0005-4000-8000-000000000005', 'Mindfulness Meditation', 'Practice 10 minutes of meditation daily for stress reduction', 'mental', 10, 'minutes', 'daily', '2024-07-01', '2024-07-22', 5, 1, datetime('now'), datetime('now')),
('d1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0002-4000-8000-000000000002', 'Hydration Tracker', 'Drink at least 2 liters of water every day', 'physical', 2, 'liters', 'daily', '2024-07-01', '2024-07-15', 1, 1, datetime('now'), datetime('now')),
('d1b2c3d4-0004-4000-8000-000000000004', 'a1b2c3d4-0003-4000-8000-000000000003', 'Sleep Quality Improvement', 'Maintain 7-8 hours of quality sleep nightly', 'sleep', 8, 'hours', 'daily', '2024-07-01', '2024-07-31', 6, 1, datetime('now'), datetime('now')),
('d1b2c3d4-0005-4000-8000-000000000005', 'a1b2c3d4-0004-4000-8000-000000000004', 'Nutrition Education', 'Complete 5 healthy eating lessons and apply learnings', 'nutrition', 5, 'lessons', 'weekly', '2024-07-01', '2024-08-31', 2, 1, datetime('now'), datetime('now')),
('d1b2c3d4-0006-4000-8000-000000000006', 'a1b2c3d4-0005-4000-8000-000000000005', 'Work-Life Balance', 'Take regular breaks and disconnect after work hours', 'social', 3, 'breaks', 'daily', '2024-07-01', '2024-08-15', 2, 1, datetime('now'), datetime('now'));

-- ML MODEL VERSIONS (5 models)
INSERT INTO model_versions (id, "modelName", version, "versionNumber", status, framework, accuracy, "trainedByUserId", "isActive", "createdAt", "updatedAt")
VALUES
('e1b2c3d4-0001-4000-8000-000000000001', 'Route Optimization Engine', 'v2.3.1', 231, 'deployed', 'TensorFlow', 0.94, 'a1b2c3d4-0001-4000-8000-000000000001', 1, datetime('now'), datetime('now')),
('e1b2c3d4-0002-4000-8000-000000000002', 'Demand Prediction Model', 'v1.8.0', 180, 'deployed', 'PyTorch', 0.89, 'a1b2c3d4-0001-4000-8000-000000000001', 1, datetime('now'), datetime('now')),
('e1b2c3d4-0003-4000-8000-000000000003', 'Fraud Detection System', 'v3.1.2', 312, 'deployed', 'XGBoost', 0.97, 'a1b2c3d4-0001-4000-8000-000000000001', 1, datetime('now'), datetime('now')),
('e1b2c3d4-0004-4000-8000-000000000004', 'Customer Segmentation', 'v1.2.0', 120, 'ready', 'Scikit-learn', 0.86, 'a1b2c3d4-0001-4000-8000-000000000001', 1, datetime('now'), datetime('now')),
('e1b2c3d4-0005-4000-8000-000000000005', 'Price Elasticity Model', 'v2.0.0', 200, 'deployed', 'TensorFlow', 0.91, 'a1b2c3d4-0001-4000-8000-000000000001', 1, datetime('now'), datetime('now'));

-- FEATURE FLAGS (5 flags)
INSERT INTO feature_flags (id, "flag_key", "flag_name", description, strategy, status, "default_value", "created_by_user_id", "created_at", "updated_at")
VALUES
('f1b2c3d4-0001-4000-8000-000000000001', 'new_dashboard_ui', 'New Dashboard UI', 'Enable redesigned dashboard interface', 'BOOLEAN', 'ENABLED', 1, 'a1b2c3d4-0001-4000-8000-000000000001', datetime('now'), datetime('now')),
('f1b2c3d4-0002-4000-8000-000000000002', 'dark_mode', 'Dark Mode', 'Allow users to switch to dark theme', 'BOOLEAN', 'ENABLED', 1, 'a1b2c3d4-0001-4000-8000-000000000001', datetime('now'), datetime('now')),
('f1b2c3d4-0003-4000-8000-000000000003', 'ai_chat_assistant', 'AI Chat Assistant', 'Beta AI-powered customer support chatbot', 'PERCENTAGE', 'ENABLED', 0, 'a1b2c3d4-0001-4000-8000-000000000001', datetime('now'), datetime('now')),
('f1b2c3d4-0004-4000-8000-000000000004', 'voice_commands', 'Voice Commands', 'Voice-based navigation and commands', 'BOOLEAN', 'DISABLED', 0, 'a1b2c3d4-0001-4000-8000-000000000001', datetime('now'), datetime('now')),
('f1b2c3d4-0005-4000-8000-000000000005', 'crypto_payments', 'Crypto Payments', 'Accept cryptocurrency for transactions', 'PERCENTAGE', 'ENABLED', 0, 'a1b2c3d4-0001-4000-8000-000000000001', datetime('now'), datetime('now'));

-- LANGUAGES (10 languages)
INSERT INTO languages (id, code, "displayName", "nativeName", direction, "isActive", "isDefault", "regionCode", "createdAt", "updatedAt")
VALUES
('1112c3d4-0001-4000-8000-000000000001', 'en', 'English', 'English', 'ltr', 1, 1, 'US', datetime('now'), datetime('now')),
('1112c3d4-0002-4000-8000-000000000002', 'es', 'Spanish', 'Español', 'ltr', 1, 0, 'ES', datetime('now'), datetime('now')),
('1112c3d4-0003-4000-8000-000000000003', 'fr', 'French', 'Français', 'ltr', 1, 0, 'FR', datetime('now'), datetime('now')),
('1112c3d4-0004-4000-8000-000000000004', 'de', 'German', 'Deutsch', 'ltr', 1, 0, 'DE', datetime('now'), datetime('now')),
('1112c3d4-0005-4000-8000-000000000005', 'pt', 'Portuguese', 'Português', 'ltr', 1, 0, 'BR', datetime('now'), datetime('now')),
('1112c3d4-0006-4000-8000-000000000006', 'zh', 'Chinese', '中文', 'ltr', 1, 0, 'CN', datetime('now'), datetime('now')),
('1112c3d4-0007-4000-8000-000000000007', 'ja', 'Japanese', '日本語', 'ltr', 1, 0, 'JP', datetime('now'), datetime('now')),
('1112c3d4-0008-4000-8000-000000000008', 'ar', 'Arabic', 'العربية', 'rtl', 1, 0, 'SA', datetime('now'), datetime('now')),
('1112c3d4-0009-4000-8000-000000000009', 'ru', 'Russian', 'Русский', 'ltr', 1, 0, 'RU', datetime('now'), datetime('now')),
('1112c3d4-0010-4000-8000-000000000010', 'it', 'Italian', 'Italiano', 'ltr', 1, 0, 'IT', datetime('now'), datetime('now'));

-- NOTIFICATION TEMPLATES (5 templates)
INSERT INTO notification_templates (id, "templateCode", "templateName", type, channel, subject, "bodyTemplate", "isActive", locale, "createdAt", "updatedAt")
VALUES
('2112c3d4-0001-4000-8000-000000000001', 'welcome_email', 'Welcome Email', 'transactional', 'email', 'Welcome to Delivery Platform!', 'Hello {{firstName}}, welcome to Delivery Platform! We are excited to have you on board.', 1, 'en', datetime('now'), datetime('now')),
('2112c3d4-0002-4000-8000-000000000002', 'order_confirmation', 'Order Confirmation', 'transactional', 'email', 'Your Order is Confirmed', 'Dear {{customerName}}, your order #{{orderId}} has been confirmed. Expected delivery: {{deliveryDate}}.', 1, 'en', datetime('now'), datetime('now')),
('2112c3d4-0003-4000-8000-000000000003', 'delivery_update', 'Delivery Update', 'info', 'push', 'Your delivery status has been updated', 'Your delivery is now {{status}}. Track it in real-time on the app.', 1, 'en', datetime('now'), datetime('now')),
('2112c3d4-0004-4000-8000-000000000004', 'payment_received', 'Payment Received', 'success', 'email', 'Payment received successfully', 'We have received your payment of ${{amount}}. Thank you for your business!', 1, 'en', datetime('now'), datetime('now')),
('2112c3d4-0005-4000-8000-000000000005', 'security_alert', 'Security Alert', 'warning', 'sms', 'New login detected', 'A new login was detected on your account from {{ipAddress}}. If this was not you, please contact support.', 1, 'en', datetime('now'), datetime('now'));

-- AUDIT LOGS (5 entries - columns: actorUserId, actorIpAddress, action, entityType, entityId, description)
INSERT INTO audit_logs (id, "actorUserId", "actorIpAddress", action, "entityType", "entityId", description, "createdAt")
VALUES
('3112c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', '127.0.0.1', 'create', 'system', 'app-server-001', 'Application server started successfully', datetime('now')),
('3112c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000001', '192.168.1.100', 'login', 'user', 'a1b2c3d4-0001-4000-8000-000000000001', 'Successful admin login', datetime('now')),
('3112c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0001-4000-8000-000000000001', '192.168.1.100', 'update', 'configuration', 'rate-limiting', 'Updated rate limit thresholds', datetime('now')),
('3112c3d4-0004-4000-8000-000000000004', 'a1b2c3d4-0001-4000-8000-000000000001', '192.168.1.100', 'approve', 'user', 'a1b2c3d4-0002-4000-8000-000000000002', 'Approved driver account verification', datetime('now')),
('3112c3d4-0005-4000-8000-000000000005', 'a1b2c3d4-0001-4000-8000-000000000001', '192.168.1.50', 'create', 'system', 'fraud-detection-v3', 'Deployed fraud detection model v3.1.2', datetime('now'));
