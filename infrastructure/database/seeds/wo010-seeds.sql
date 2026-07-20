-- ============================================
-- WO-010 Seeds: Communities, Memberships, Profiles, Policy Consents
-- ============================================

-- Communities
INSERT INTO communities (id, name, slug, description, community_type, membership_approval, owner_id, category, language, rules, avatar_url, member_count, is_active, created_at, updated_at)
VALUES
  ('comm-001-uuid-a1b2c3d4', 'Delivery Professionals Network', 'delivery-professionals', 'Network for delivery couriers and logistics professionals', 'public', 'open', 'user-uuid-001', 'professional', 'en-US', 'Be respectful, no spam, professional conduct expected', '/avatars/community-001.png', 156, 1, datetime('now'), datetime('now')),
  ('comm-002-uuid-b2c3d4e5', 'Merchant Partnership Program', 'merchant-partners', 'Exclusive community for merchant partners and B2B customers', 'private', 'request_required', 'user-uuid-002', 'business', 'en-US', 'Verified merchants only, quarterly reviews, NDA required', '/avatars/community-002.png', 89, 1, datetime('now'), datetime('now')),
  ('comm-003-uuid-c3d4e5f6', 'Local Food Scene', 'local-food-scene', 'Food enthusiasts and local restaurant supporters', 'public', 'open', 'user-uuid-003', 'interest', 'es-ES', 'Share experiences, rate restaurants, organize meetups', '/avatars/community-003.png', 342, 1, datetime('now'), datetime('now')),
  ('comm-004-uuid-d4e5f6a7', 'Community Moderators', 'moderators', 'Internal team for content moderation and trust & safety', 'federated', 'invite_only', 'user-uuid-001', 'internal', 'en-US', 'Confidential information handling, 24/7 rotation schedule', NULL, 24, 1, datetime('now'), datetime('now'));

-- Community Memberships
INSERT INTO community_memberships (id, community_id, user_id, role_id, status, join_reason, approved_by, approved_comments, joined_at, created_at, updated_at)
VALUES
  ('mem-001-uuid-e5f6a7b8', 'comm-001-uuid-a1b2c3d4', 'user-uuid-001', 'role-member', 'approved', 'professional', 'user-uuid-002', 'Welcome aboard!', datetime('now'), datetime('now'), datetime('now')),
  ('mem-002-uuid-f6a7b8c9', 'comm-001-uuid-a1b2c3d4', 'user-uuid-002', 'role-admin', 'approved', 'assigned', 'user-uuid-002', 'Admin access granted', datetime('now', '-30 days'), datetime('now'), datetime('now')),
  ('mem-003-uuid-a7b8c9d0', 'comm-002-uuid-b2c3d4e5', 'user-uuid-001', 'role-member', 'approved', 'professional', 'user-uuid-003', 'Verified merchant partner', datetime('now'), datetime('now'), datetime('now')),
  ('mem-004-uuid-b8c9d0e1', 'comm-002-uuid-b2c3d4e5', 'user-uuid-002', 'role-member', 'approved', 'invited', 'user-uuid-003', 'Invited by admin', datetime('now'), datetime('now'), datetime('now')),
  ('mem-005-uuid-c9d0e1f2', 'comm-003-uuid-c3d4e5f6', 'user-uuid-003', 'role-member', 'approved', 'interest', NULL, NULL, datetime('now'), datetime('now'), datetime('now')),
  ('mem-006-uuid-d0e1f2a3', 'comm-004-uuid-d4e5f6a7', 'user-uuid-001', 'role-moderator', 'approved', 'assigned', 'user-uuid-002', 'Moderator duty assigned', datetime('now'), datetime('now'), datetime('now')),
  ('mem-007-uuid-e1f2a3b4', 'comm-001-uuid-a1b2c3d4', 'user-uuid-003', 'role-member', 'pending', 'interested', NULL, NULL, NULL, datetime('now'), datetime('now'));

-- Profiles
INSERT INTO profiles (id, user_id, visibility, verification_level, display_name, bio, skills, interests, location, website_url, is_complete, is_active, created_at, updated_at)
VALUES
  ('prof-001-uuid-a1b2c3d4', 'user-uuid-001', 'public', ProfileVerificationLevel.PHONE_VERIFIED, 'Alex Johnson', 'Logistics expert with 5+ years experience', 'route-optimization,customer-service,negotiation', 'travel,food,technology', 'New York, NY', 'https://alexjohnson.dev', 1, 1, datetime('now'), datetime('now')),
  ('prof-002-uuid-b2c3d4e5', 'user-uuid-002', 'profile_visible', ProfileVerificationLevel.EMAIL_VERIFIED, 'Maria Garcia', 'Restaurant owner and food enthusiast', 'management,customer-relations,social-media', 'cooking,wine,sports', 'Los Angeles, CA', 'https://marianrestaurant.com', 1, 1, datetime('now'), datetime('now')),
  ('prof-003-uuid-c3d4e5f6', 'user-uuid-003', 'members_only', ProfileVerificationLevel.EMAIL_VERIFIED, 'Chris Lee', 'Software engineer and community builder', 'full-stack,machine-learning,data-analysis', 'gaming,hiking,photography', 'San Francisco, CA', NULL, 1, 1, datetime('now'), datetime('now'));

-- Policy Consents
INSERT INTO policy_consents (id, user_id, policy_id, action, version, agreed_at, consented_by, metadata, created_at, updated_at)
VALUES
  ('consent-001-uuid-d4e5f6a7', 'user-uuid-001', 'policy-terms-v2', 'agreed', '2.0', datetime('now'), NULL, '{"ip":"192.168.1.1","browser":"Chrome"}', datetime('now'), datetime('now')),
  ('consent-002-uuid-e5f6a7b8', 'user-uuid-001', 'policy-privacy-v1', 'agreed', '1.0', datetime('now'), NULL, '{"ip":"192.168.1.1"}', datetime('now'), datetime('now')),
  ('consent-003-uuid-f6a7b8c9', 'user-uuid-002', 'policy-terms-v2', 'agreed', '2.0', datetime('now'), NULL, '{"ip":"10.0.0.1"}', datetime('now'), datetime('now')),
  ('consent-004-uuid-a7b8c9d0', 'user-uuid-002', 'policy-marketing-v1', 'withdrawn', '1.0', datetime('now', '-6 months'), datetime('now'), 'Changed mind', datetime('now', '-6 months'), datetime('now')),
  ('consent-005-uuid-b8c9d0e1', 'user-uuid-003', 'policy-terms-v2', 'agreed', '2.0', datetime('now'), NULL, '{"ip":"172.16.0.1"}', datetime('now'), datetime('now'));
