-- WO-011: Governance Seeds (Assemblies, Proposals, Ballots, Votes, Health Metrics)

INSERT INTO assemblies (id, "title", "description", "status", "scheduledAt", "createdAt", "updatedAt") VALUES
('asm-001-4000-8000-000000000001', 'Asamblea General Q3 2026', 'Asamblea trimestral para decisiones de plataforma', 'scheduled', datetime('now','+7 days'), datetime('now','-10 days'), datetime('now','-10 days')),
('asm-002-4000-8000-000000000002', 'Votación Política de Privacidad', 'Aprobación de nueva política de privacidad', 'active', datetime('now','-1 days'), datetime('now','-5 days'), datetime('now','-1 days'));

INSERT INTO proposals (id, "assemblyId", "title", "description", "status", "proposedBy", "createdAt", "updatedAt") VALUES
('prp-001-4000-8000-000000000001', 'asm-001-4000-8000-000000000001', 'Incrementar tarifa de entrega', 'Proponer incremento de $2 a $2.50 por entrega', 'under_review', 'a1b2c3d4-0001-4000-8000-000000000001', datetime('now','-8 days'), datetime('now','-8 days')),
('prp-002-4000-8000-000000000002', 'asm-002-4000-8000-000000000002', 'Nueva Política de Datos', 'Actualizar política de datos de usuarios', 'approved', 'a1b2c3d4-0002-4000-8000-000000000002', datetime('now','-4 days'), datetime('now','-1 days'));

INSERT INTO ballots (id, "assemblyId", "title", "description", "options", "status", "openingAt", "closingAt", "results", "createdAt") VALUES
('blt-001-4000-8000-000000000001', 'asm-002-4000-8000-000000000002', 'Aprobación Política de Datos', 'Votar aprobación de nueva política', '["approve","reject","abstain"]', 'closed', datetime('now','-3 days'), datetime('now','-1 days'), '{"approve":156,"reject":23,"abstain":8}', datetime('now','-3 days')),
('blt-002-4000-8000-000000000002', 'asm-001-4000-8000-000000000001', 'Incremento de Tarifa', 'Votar sobre el incremento propuesto', '["yes","no","abstain"]', 'open', datetime('now','+7 days'), datetime('now','+14 days'), '{}', datetime('now','-2 days'));

INSERT INTO votes (id, "ballotId", "userId", "choice", "votedAt", "createdAt", "updatedAt") VALUES
('vot-001-4000-8000-000000000001', 'blt-001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'approve', datetime('now','-2 days'), datetime('now','-2 days'), datetime('now','-2 days')),
('vot-002-4000-8000-000000000002', 'blt-001-4000-8000-000000000001', 'a1b2c3d4-0002-4000-8000-000000000002', 'reject', datetime('now','-2 days'), datetime('now','-2 days'), datetime('now','-2 days')),
('vot-003-4000-8000-000000000003', 'blt-001-4000-8000-000000000001', 'a1b2c3d4-0003-4000-8000-000000000003', 'approve', datetime('now','-1 days'), datetime('now','-1 days'), datetime('now','-1 days'));

INSERT INTO community_health_metrics (id, "metricName", "metricValue", "metricUnit", "recordedAt", "createdAt", "updatedAt") VALUES
('chm-001-4000-8000-000000000001', 'participation_rate', 72.5, 'percentage', datetime('now','-1 days'), datetime('now','-1 days'), datetime('now','-1 days')),
('chm-002-4000-8000-000000000002', 'proposal_approval_rate', 85.0, 'percentage', datetime('now','-1 days'), datetime('now','-1 days'), datetime('now','-1 days')),
('chm-003-4000-8000-000000000003', 'active_members', 1240, 'count', datetime('now','-1 days'), datetime('now','-1 days'), datetime('now','-1 days')),
('chm-004-4000-8000-000000000004', 'avg_vote_turnout', 68.3, 'percentage', datetime('now','-1 days'), datetime('now','-1 days'), datetime('now','-1 days'));
