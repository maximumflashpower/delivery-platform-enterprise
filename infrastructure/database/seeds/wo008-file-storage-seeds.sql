-- WO-008: File Storage Editor Seeds

INSERT INTO file_editor_drafts (id, "userId", "title", "content", "format", "version", "autoSaveAt", "createdAt", "updatedAt") VALUES
('ed-001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'Welcome Guide', '# Welcome to the Platform\n\nThis is a guide for new users.', 'markdown', 3, datetime('now','-2 hours'), datetime('now','-2 hours'), datetime('now','-2 hours')),
('ed-002-4000-8000-000000000002', 'a1b2c3d4-0002-4000-8000-000000000002', 'Delivery Policy Draft', '<h1>Delivery Policy</h1>\n<p>All deliveries must be completed within 30 minutes.</p>', 'html', 1, datetime('now','-1 hour'), datetime('now','-1 hour'), datetime('now','-1 hour')),
('ed-003-4000-8000-000000000003', 'a1b2c3d4-0001-4000-8000-000000000001', 'Monthly Report', '# Monthly Performance\n\nRevenue: $45,000\nOrders: 1,240', 'markdown', 5, datetime('now','-10 minutes'), datetime('now','-10 minutes'), datetime('now','-10 minutes'));

INSERT INTO file_multi_format_publications (id, "sourceFileId", "createdByUserId", "title", "sourceFormat", "outputFormats", "status", "createdAt") VALUES
('pub-001-4000-8000-000000000001', 'ed-001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'Welcome Guide Publication', 'markdown', '["html","pdf","epub"]', 'published', datetime('now','-1 hour')),
('pub-002-4000-8000-000000000002', 'ed-002-4000-8000-000000000002', 'a1b2c3d4-0002-4000-8000-000000000002', 'Policy HTML Export', 'html', '["pdf","docx"]', 'processing', datetime('now','-30 minutes'));
