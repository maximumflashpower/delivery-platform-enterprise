-- WO-012: Trust & Safety Seeds

INSERT INTO trust_safety_reason_codes (id, "code", "title", "description", "severity", "autoAction", "guidelines", "priorityWeight", "usageCount", "createdAt", "updatedAt") VALUES
('rc-001-4000-8000-000000000001', 'harassment', 'Harassment', 'Repeated unwanted contact or threatening behavior', 'high', 'flag_for_review', 'Document all instances with timestamps and screenshots', 80, 0, datetime('now','-30 days'), datetime('now','-30 days')),
('rc-002-4000-8000-000000000002', 'hate_speech', 'Hate Speech', 'Content attacking protected groups', 'critical', 'auto_remove', 'Immediate escalation required', 100, 0, datetime('now','-30 days'), datetime('now','-30 days')),
('rc-003-4000-8000-000000000003', 'spam', 'Spam', 'Unsolicited promotional content', 'low', 'flag_for_review', 'Check posting frequency and recipient complaints', 30, 0, datetime('now','-30 days'), datetime('now','-30 days')),
('rc-004-4000-8000-000000000004', 'fake_account', 'Fake Account', 'Misrepresentation of identity', 'medium', 'flag_for_review', 'Verify identity documents and account activity', 60, 0, datetime('now','-30 days'), datetime('now','-30 days')),
('rc-005-4000-8000-000000000005', 'violence', 'Violence', 'Threats of physical harm', 'critical', 'auto_remove', 'Contact authorities if imminent danger identified', 100, 0, datetime('now','-30 days'), datetime('now','-30 days'));

INSERT INTO trust_safety_moderation_queue (id, "contentId", "contentType", "reportedByUserId", "flaggedUserId", "reasonCode", "status", "priority", "createdAt", "updatedAt") VALUES
('mq-001-4000-8000-000000000001', 'post-123-4000-8000-000000000001', 'post', 'a1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0002-4000-8000-000000000002', 'harassment', 'pending', 80, datetime('now','-2 days'), datetime('now','-2 days')),
('mq-002-4000-8000-000000000002', 'comment-456-4000-8000-000000000001', 'comment', 'a1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0002-4000-8000-000000000002', 'hate_speech', 'in_review', 100, datetime('now','-1 days'), datetime('now','-1 days')),
('mq-003-4000-8000-000000000003', 'msg-789-4000-8000-000000000001', 'message', 'a1b2c3d4-0004-4000-8000-000000000004', 'a1b2c3d4-0002-4000-8000-000000000002', 'spam', 'approved', 30, datetime('now','-3 days'), datetime('now','-2 days')),
('mq-004-4000-8000-000000000004', 'profile-101-4000-8000-000000000001', 'profile', 'a1b2c3d4-0005-4000-8000-000000000005', 'a1b2c3d4-0006-4000-8000-000000000006', 'fake_account', 'pending', 60, datetime('now','-1 days'), datetime('now','-1 days')),
('mq-005-4000-8000-000000000005', 'post-202-4000-8000-000000000001', 'post', 'a1b2c3d4-0007-4000-8000-000000000007', 'a1b2c3d4-0008-4000-8000-000000000008', 'violence', 'escalated', 100, datetime('now','-4 hours'), datetime('now','-1 hours'));
