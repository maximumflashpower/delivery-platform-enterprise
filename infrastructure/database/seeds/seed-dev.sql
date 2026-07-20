-- ============================================
-- DELIVERY PLATFORM - SEED DATA
-- ============================================

-- IDENTITY USERS (5 users)
INSERT INTO identity_users (id, email, password, "firstName", "lastName", role, status, phone, verified, "createdAt", "updatedAt")
VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'admin@delivery.com', '$2b$10$placeholderHashForAdmin123456789012345678901234', 'System', 'Administrator', 'ADMIN', 'ACTIVE', '+1-555-0001', 1, datetime('now'), datetime('now')),
('a1b2c3d4-0002-4000-8000-000000000002', 'driver@delivery.com', '$2b$10$placeholderHashForDriver1234567890123456789012', 'John', 'Driver', 'DRIVER', 'ACTIVE', '+1-555-0101', 1, datetime('now'), datetime('now')),
('a1b2c3d4-0003-4000-8000-000000000003', 'courier@delivery.com', '$2b$10$placeholderHashForCourier123456789012345678', 'Maria', 'Courier', 'COURIER', 'ACTIVE', '+1-555-0201', 1, datetime('now'), datetime('now')),
('a1b2c3d4-0004-4000-8000-000000000004', 'merchant@delivery.com', '$2b$10$placeholderHashForMerchant123456789012345678', 'Carlos', 'Merchant', 'MERCHANT', 'ACTIVE', '+1-555-0301', 1, datetime('now'), datetime('now')),
('a1b2c3d4-0005-4000-8000-000000000005', 'customer@delivery.com', '$2b$10$placeholderHashForCustomer123456789012345678', 'Ana', 'Customer', 'CUSTOMER', 'ACTIVE', '+1-555-0401', 1, datetime('now'), datetime('now'));

-- GOVERNANCE POLICIES (5 policies)
INSERT INTO governance_policies (id, name, description, category, status, version, "effectiveDate", "createdAt", "updatedAt")
VALUES
('b1b2c3d4-0001-4000-8000-000000000001', 'Data Privacy Policy', 'Governs collection, storage, and processing of user personal data in compliance with GDPR and CCPA.', 'PRIVACY', 'ACTIVE', '1.0', '2024-01-01', datetime('now'), datetime('now')),
('b1b2c3d4-0002-4000-8000-000000000002', 'Driver Safety Protocol', 'Establishes minimum safety standards for driver onboarding, vehicle inspection, and ongoing compliance monitoring.', 'SAFETY', 'ACTIVE', '2.1', '2024-03-15', datetime('now'), datetime('now')),
('b1b2c3d4-0003-4000-8000-000000000003', 'Transaction Fraud Prevention', 'Defines anti-fraud measures for payment processing, chargeback handling, and suspicious activity detection.', 'SECURITY', 'ACTIVE', '1.5', '2024-02-01', datetime('now'), datetime('now')),
('b1b2c3d4-0004-4000-8000-000000000004', 'Environmental Sustainability', 'Carbon offset requirements, eco-friendly delivery options, and green logistics initiatives.', 'ENVIRONMENTAL', 'ACTIVE', '1.0', '2024-06-01', datetime('now'), datetime('now')),
('b1b2c3d4-0005-4000-8000-000000000005', 'Accessibility Standards', 'WCAG 2.1 compliance requirements for digital services and physical accessibility accommodations.', 'ACCESSIBILITY', 'ACTIVE', '2.0', '2024-01-15', datetime('now'), datetime('now'));

-- CHAT ROOMS (6 rooms)
INSERT INTO chat_rooms (id, name, description, type, "maxParticipants", "isActive", "createdAt", "updatedAt")
VALUES
('c1b2c3d4-0001-4000-8000-000000000001', 'General Discussion', 'Main channel for platform-wide announcements and general conversation', 'PUBLIC', 1000, 1, datetime('now'), datetime('now')),
('c1b2c3d4-0002-4000-8000-000000000002', 'Driver Support', 'Help and support channel for drivers', 'PUBLIC', 500, 1, datetime('now'), datetime('now')),
('c1b2c3d4-0003-4000-8000-000000000003', 'Merchant Partnerships', 'Coordination channel for merchant onboarding and partnerships', 'PRIVATE', 50, 1, datetime('now'), datetime('now')),
('c1b2c3d4-0004-4000-8000-000000000004', 'Technical Issues', 'Bug reports, feature requests, and technical troubleshooting', 'PUBLIC', 1000, 1, datetime('now'), datetime('now')),
('c1b2c3d4-0005-4000-8000-000000000005', 'Executive Team', 'Internal executive decision-making channel', 'RESTRICTED', 15, 1, datetime('now'), datetime('now')),
('c1b2c3d4-0006-4000-8000-000000000006', 'Customer Feedback', 'Collect and discuss customer reviews and suggestions', 'PUBLIC', 200, 1, datetime('now'), datetime('now'));

-- WELLNESS GOALS (6 goals)
INSERT INTO wellness_goals (id, title, description, category, points, "durationDays", "isActive", "createdAt", "updatedAt")
VALUES
('d1b2c3d4-0001-4000-8000-000000000001', 'Physical Activity Challenge', 'Complete 10,000 steps daily for 30 consecutive days', 'PHYSICAL', 500, 30, 1, datetime('now'), datetime('now')),
('d1b2c3d4-0002-4000-8000-000000000002', 'Mindfulness Meditation', 'Practice 10 minutes of meditation daily for stress reduction', 'MENTAL', 300, 21, 1, datetime('now'), datetime('now')),
('d1b2c3d4-0003-4000-8000-000000000003', 'Hydration Tracker', 'Drink at least 2 liters of water every day', 'PHYSICAL', 200, 14, 1, datetime('now'), datetime('now')),
('d1b2c3d4-0004-4000-8000-000000000004', 'Sleep Quality Improvement', 'Maintain 7-8 hours of quality sleep nightly', 'HEALTH', 400, 30, 1, datetime('now'), datetime('now')),
('d1b2c3d4-0005-4000-8000-000000000005', 'Nutrition Education', 'Complete 5 healthy eating lessons and apply learnings', 'NUTRITION', 600, 60, 1, datetime('now'), datetime('now')),
('d1b2c3d4-0006-4000-8000-000000000006', 'Work-Life Balance', 'Take regular breaks and disconnect after work hours', 'MENTAL', 350, 45, 1, datetime('now'), datetime('now'));

-- ML MODEL VERSIONS (5 models)
INSERT INTO model_versions (id, name, version, type, framework, accuracy, status, "trainedDate", "createdAt", "updatedAt")
VALUES
('e1b2c3d4-0001-4000-8000-000000000001', 'Route Optimization Engine', 'v2.3.1', 'OPTIMIZATION', 'TensorFlow', 0.94, 'DEPLOYED', '2024-05-15', datetime('now'), datetime('now')),
('e1b2c3d4-0002-4000-8000-000000000002', 'Demand Prediction Model', 'v1.8.0', 'PREDICTION', 'PyTorch', 0.89, 'DEPLOYED', '2024-04-20', datetime('now'), datetime('now')),
('e1b2c3d4-0003-4000-8000-000000000003', 'Fraud Detection System', 'v3.1.2', 'CLASSIFICATION', 'XGBoost', 0.97, 'DEPLOYED', '2024-06-01', datetime('now'), datetime('now')),
('e1b2c3d4-0004-4000-8000-000000000004', 'Customer Segmentation', 'v1.2.0', 'CLUSTERING', 'Scikit-learn', 0.86, 'STAGING', '2024-06-10', datetime('now'), datetime('now')),
('e1b2c3d4-0005-4000-8000-000000000005', 'Price Elasticity Model', 'v2.0.0', 'REGRESSION', 'TensorFlow', 0.91, 'DEPLOYED', '2024-03-25', datetime('now'), datetime('now'));

-- FEATURE FLAGS (5 flags)
INSERT INTO feature_flags (id, name, key, description, enabled, "rolloutPercentage", "createdAt", "updatedAt")
VALUES
('f1b2c3d4-0001-4000-8000-000000000001', 'New Dashboard UI', 'new_dashboard_ui', 'Enable redesigned dashboard interface', 1, 100, datetime('now'), datetime('now')),
('f1b2c3d4-0002-4000-8000-000000000002', 'Dark Mode', 'dark_mode', 'Allow users to switch to dark theme', 1, 100, datetime('now'), datetime('now')),
('f1b2c3d4-0003-4000-8000-000000000003', 'AI Chat Assistant', 'ai_chat_assistant', 'Beta AI-powered customer support chatbot', 1, 50, datetime('now'), datetime('now')),
('f1b2c3d4-0004-4000-8000-000000000004', 'Voice Commands', 'voice_commands', 'Voice-based navigation and commands', 0, 0, datetime('now'), datetime('now')),
('f1b2c3d4-0005-4000-8000-000000000005', 'Crypto Payments', 'crypto_payments', 'Accept cryptocurrency for transactions', 1, 25, datetime('now'), datetime('now'));

-- LANGUAGES (10 languages)
INSERT INTO languages (id, code, name, "nativeName", "isActive", "createdAt", "updatedAt")
VALUES
('1112c3d4-0001-4000-8000-000000000001', 'en', 'English', 'English', 1, datetime('now'), datetime('now')),
('1112c3d4-0002-4000-8000-000000000002', 'es', 'Spanish', 'Español', 1, datetime('now'), datetime('now')),
('1112c3d4-0003-4000-8000-000000000003', 'fr', 'French', 'Français', 1, datetime('now'), datetime('now')),
('1112c3d4-0004-4000-8000-000000000004', 'de', 'German', 'Deutsch', 1, datetime('now'), datetime('now')),
('1112c3d4-0005-4000-8000-000000000005', 'pt', 'Portuguese', 'Português', 1, datetime('now'), datetime('now')),
('1112c3d4-0006-4000-8000-000000000006', 'zh', 'Chinese', '中文', 1, datetime('now'), datetime('now')),
('1112c3d4-0007-4000-8000-000000000007', 'ja', 'Japanese', '日本語', 1, datetime('now'), datetime('now')),
('1112c3d4-0008-4000-8000-000000000008', 'ar', 'Arabic', 'العربية', 1, datetime('now'), datetime('now')),
('1112c3d4-0009-4000-8000-000000000009', 'hi', 'Hindi', 'हिन्दी', 1, datetime('now'), datetime('now')),
('1112c3d4-0010-4000-8000-000000000010', 'ru', 'Russian', 'Русский', 1, datetime('now'), datetime('now'));

-- NOTIFICATION TEMPLATES (5 templates)
INSERT INTO notification_templates (id, name, subject, type, category, "isActive", "createdAt", "updatedAt")
VALUES
('2112c3d4-0001-4000-8000-000000000001', 'Welcome Email', 'Welcome to Delivery Platform!', 'EMAIL', 'WELCOME', 1, datetime('now'), datetime('now')),
('2112c3d4-0002-4000-8000-000000000002', 'Order Confirmation', 'Your Order is Confirmed', 'EMAIL', 'ORDER', 1, datetime('now'), datetime('now')),
('2112c3d4-0003-4000-8000-000000000003', 'Delivery Update', 'Your delivery status has been updated', 'PUSH', 'DELIVERY', 1, datetime('now'), datetime('now')),
('2112c3d4-0004-4000-8000-000000000004', 'Payment Received', 'Payment received successfully', 'EMAIL', 'PAYMENT', 1, datetime('now'), datetime('now')),
('2112c3d4-0005-4000-8000-000000000005', 'Security Alert', 'New login detected', 'SMS', 'SECURITY', 1, datetime('now'), datetime('now'));

-- AUDIT LOGS (5 entries)
INSERT INTO audit_logs (id, action, "entityType", "entityId", "userId", details, "ipAddress", "createdAt")
VALUES
('3112c3d4-0001-4000-8000-000000000001', 'SYSTEM_STARTUP', 'SYSTEM', 'app-server-001', NULL, 'Application server started successfully', '127.0.0.1', datetime('now')),
('3112c3d4-0002-4000-8000-000000000002', 'USER_LOGIN', 'USER', 'admin@delivery.com', 'system', 'Successful login from IP 192.168.1.100', '192.168.1.100', datetime('now')),
('3112c3d4-0003-4000-8000-000000000003', 'DATA_EXPORT', 'POLICY', 'policy-privacy-001', 'admin@delivery.com', 'Exported privacy policy configuration', '192.168.1.100', datetime('now')),
('3112c3d4-0004-4000-8000-000000000004', 'SETTINGS_UPDATE', 'CONFIGURATION', 'rate-limiting', 'admin@delivery.com', 'Updated rate limit thresholds from 100 to 150 req/min', '192.168.1.100', datetime('now')),
('3112c3d4-0005-4000-8000-000000000005', 'MODEL_DEPLOYMENT', 'ML_MODEL', 'fraud-detection-v3', 'ml-engineer@delivery.com', 'Deployed fraud detection model v3.1.2 to production', '192.168.1.50', datetime('now'));
