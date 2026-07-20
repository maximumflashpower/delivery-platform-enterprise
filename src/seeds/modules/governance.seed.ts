import { DataSource } from 'typeorm';

export async function seedGovernance(dataSource: DataSource): Promise<void> {
  const policies = [
    {
      name: 'Data Privacy Policy',
      description: 'Governs collection, storage, and processing of user personal data in compliance with GDPR and CCPA.',
      category: 'PRIVACY',
      status: 'ACTIVE',
      version: '1.0',
      effectiveDate: new Date('2024-01-01'),
    },
    {
      name: 'Driver Safety Protocol',
      description: 'Establishes minimum safety standards for driver onboarding, vehicle inspection, and ongoing compliance monitoring.',
      category: 'SAFETY',
      status: 'ACTIVE',
      version: '2.1',
      effectiveDate: new Date('2024-03-15'),
    },
    {
      name: 'Transaction Fraud Prevention',
      description: 'Defines anti-fraud measures for payment processing, chargeback handling, and suspicious activity detection.',
      category: 'SECURITY',
      status: 'ACTIVE',
      version: '1.5',
      effectiveDate: new Date('2024-02-01'),
    },
    {
      name: 'Environmental Sustainability',
      description: 'Carbon offset requirements, eco-friendly delivery options, and green logistics initiatives.',
      category: 'ENVIRONMENTAL',
      status: 'ACTIVE',
      version: '1.0',
      effectiveDate: new Date('2024-06-01'),
    },
    {
      name: 'Accessibility Standards',
      description: 'WCAG 2.1 compliance requirements for digital services and physical accessibility accommodations.',
      category: 'ACCESSIBILITY',
      status: 'ACTIVE',
      version: '2.0',
      effectiveDate: new Date('2024-01-15'),
    },
  ];

  const result = await dataSource.manager.query(`
    INSERT INTO governance_policies (name, description, category, status, version, "effectiveDate", "createdAt", "updatedAt")
    VALUES ${policies.map((_, i) => `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${i * 7 + 5}, $${i * 7 + 6}, NOW(), NOW())`).join(',')}
    RETURNING id, name;
  `, policies.flatMap(p => [p.name, p.description, p.category, p.status, p.version, p.effectiveDate]));

  console.log(`   Created ${result.length} governance policies`);
}
