-- WO-009: Versionado, Colaboración y Derechos Básicos Seeds

INSERT INTO file_versions (id, "fileId", "createdByUserId", "versionNumber", "content", "format", "changeDescription", "isCurrent", "sizeBytes", "createdAt") VALUES
('fv-001-4000-8000-000000000001', 'ed-001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 1, '# Welcome Guide v1', 'markdown', 'Initial version', 0, 1024, datetime('now','-5 days')),
('fv-002-4000-8000-000000000002', 'ed-001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 2, '# Welcome Guide v2\n\nUpdated content', 'markdown', 'Added intro section', 0, 1280, datetime('now','-2 days')),
('fv-003-4000-8000-000000000003', 'ed-001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 3, '# Welcome Guide v3\n\nFinal version with FAQ', 'markdown', 'Added FAQ', 1, 1536, datetime('now','-1 days'));

INSERT INTO file_collaborators (id, "fileId", "userId", "role", "isActive", "invitedBy", "acceptedAt", "createdAt", "updatedAt") VALUES
('fc-001-4000-8000-000000000001', 'ed-001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'owner', 1, NULL, datetime('now','-5 days'), datetime('now','-5 days'), datetime('now','-5 days')),
('fc-002-4000-8000-000000000002', 'ed-001-4000-8000-000000000001', 'a1b2c3d4-0002-4000-8000-000000000002', 'editor', 1, 'a1b2c3d4-0001-4000-8000-000000000001', datetime('now','-3 days'), datetime('now','-4 days'), datetime('now','-3 days')),
('fc-003-4000-8000-000000000003', 'ed-002-4000-8000-000000000002', 'a1b2c3d4-0002-4000-8000-000000000002', 'commenter', 1, 'a1b2c3d4-0002-4000-8000-000000000002', datetime('now','-2 days'), datetime('now','-3 days'), datetime('now','-2 days'));

INSERT INTO file_rights (id, "fileId", "rightsHolderId", "rightsType", "license", "licenseUrl", "commercialUseAllowed", "modificationsAllowed", "usageRestrictions", "createdAt", "updatedAt") VALUES
('fr-001-4000-8000-000000000001', 'ed-001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'creative-commons', 'CC-BY-4.0', 'https://creativecommons.org/licenses/by/4.0/', 1, 1, 'Attribution required', datetime('now','-5 days'), datetime('now','-5 days')),
('fr-002-4000-8000-000000000002', 'ed-002-4000-8000-000000000002', 'a1b2c3d4-0002-4000-8000-000000000002', 'proprietary', 'Internal Use Only', '', 0, 0, 'No distribution allowed', datetime('now','-3 days'), datetime('now','-3 days'));
