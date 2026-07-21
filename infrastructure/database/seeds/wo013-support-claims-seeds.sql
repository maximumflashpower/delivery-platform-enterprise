-- WO-013: Support Claims Seeds

INSERT INTO support_claims_appeals (id, "claimId", "userId", "appealType", "groundsForAppeal", "status", "version", "createdAt", "updatedAt") VALUES
('app-001-4000-8000-000000000001', 'clm-001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'content_removal', 'My post was incorrectly removed as harassment. I was responding to a complaint, not initiating one.', 'submitted', 1, datetime('now','-2 days'), datetime('now','-2 days')),
('app-002-4000-8000-000000000002', 'clm-002-4000-8000-000000000002', 'a1b2c3d4-0002-4000-8000-000000000002', 'account_action', 'My account suspension was unwarranted. I have proof of identity and good standing.', 'under_review', 1, datetime('now','-1 days'), datetime('now','-1 days'));

INSERT INTO support_claims_victim_cases (id, "userId", "caseType", "description", "isUrgent", "status", "safetyPlan", "createdAt", "updatedAt") VALUES
('vsc-001-4000-8000-000000000001', 'a1b2c3d4-0003-4000-8000-000000000003', 'harassment', 'User has been receiving persistent threatening messages over 3 weeks despite blocking attempts.', 1, 'open', 'Blocked sender, documented all messages, considering legal action.', datetime('now','-5 days'), datetime('now','-1 days')),
('vsc-002-4000-8000-000000000002', 'a1b2c3d4-0004-4000-8000-000000000004', 'impersonation', 'Someone created a fake profile using my photos and identity.', 1, 'assigned', 'Reported impersonation, gathering evidence for takedown request.', datetime('now','-3 days'), datetime('now','-2 days')),
('vsc-003-4000-8000-000000000003', 'a1b2c3d4-0005-4000-8000-000000000005', 'doxxing', 'Personal information including home address was posted publicly without consent.', 1, 'in_progress', 'Legal counsel consulted, requesting emergency content removal.', datetime('now','-2 days'), datetime('now','-12 hours'));

INSERT INTO support_claims_appeal_evidence (id, "appealId", "uploadedByUserId", "fileId", "evidenceType", "description", "isVerified", "createdAt") VALUES
('ae-001-4000-8000-000000000001', 'app-001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'file-123-4000-8000-000000000001', 'screenshot', 'Screenshot showing original context before removal', 1, datetime('now','-2 days')),
('ae-002-4000-8000-000000000002', 'app-001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'file-456-4000-8000-000000000001', 'message_log', 'Full conversation thread showing mutual consent', 1, datetime('now','-2 days')),
('ae-003-4000-8000-000000000003', 'app-002-4000-8000-000000000002', 'a1b2c3d4-0002-4000-8000-000000000002', 'file-789-4000-8000-000000000001', 'document', 'Government-issued ID verification', 0, datetime('now','-1 days'));
