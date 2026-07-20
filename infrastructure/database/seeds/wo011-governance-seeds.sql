-- WO-011: Governance Seeds (Voting, Assemblies, Community Health)

INSERT INTO governance_assemblies (id, title, description, scheduled_start, scheduled_end, status, type, community_id, allows_remote_voting, requires_quorum, quorum_percentage) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Annual General Assembly 2026', 'Annual community assembly to discuss platform direction and elect representatives', '2026-08-01 10:00:00', '2026-08-01 16:00:00', 'scheduled', 'general', 'c001', true, true, 50),
('a1b2c3d4-e5f6-7890-abcd-ef1234567891', 'Emergency Budget Meeting', 'Emergency assembly to approve Q3 budget amendments', '2026-07-25 14:00:00', '2026-07-25 17:00:00', 'scheduled', 'budget', 'c001', true, false, 0);

INSERT INTO governance_proposals (id, title, description, category, status, assembly_id, submitted_by, voting_start_date, voting_end_date) VALUES
('p001', 'Increase Platform Fee Cap', 'Propose increasing maximum platform fee from 15% to 18% for premium services', 'policy', 'active', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'u001', '2026-07-20 00:00:00', '2026-07-30 23:59:59'),
('p002', 'New Verification Badge System', 'Implement tiered verification badges based on community contributions', 'structural', 'pending', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'u002', '2026-07-22 00:00:00', '2026-08-05 23:59:59');

INSERT INTO governance_ballots (id, assembly_id, name, method, min_choices, max_choices, is_active, opens_at, closes_at) VALUES
('b001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'AGM 2026 Ballot', 'majority', 1, 1, true, '2026-07-20 00:00:00', '2026-08-01 16:00:00');

INSERT INTO governance_votes (id, user_id, proposal_id, choice, weight, rationale, voted_at) VALUES
('v001', 'u001', 'p001', 'yes', 1.5, 'Supports sustainable growth of the platform', '2026-07-20 10:30:00'),
('v002', 'u002', 'p001', 'no', 1.0, 'Concerned about impact on small merchants', '2026-07-20 11:15:00'),
('v003', 'u003', 'p001', 'yes', 1.0, 'Agree with the proposal', '2026-07-20 12:00:00');

INSERT INTO governance_community_health_metrics (id, community_id, recorded_at, total_members, active_members, participation_rate, open_proposals, approved_proposals, trust_score) VALUES
('h001', 'c001', '2026-07-20 00:00:00', 1250, 450, 36.0, 3, 12, 85.5);
