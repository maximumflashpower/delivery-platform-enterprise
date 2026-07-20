import { DataSource, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export async function seedIdentity(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    const users = [
      {
        email: 'admin@delivery.com',
        password: await bcrypt.hash('Admin@2024!', 10),
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN',
        status: 'ACTIVE',
        phone: '+1-555-0001',
        verified: true,
      },
      {
        email: 'driver@delivery.com',
        password: await bcrypt.hash('Driver@2024!', 10),
        firstName: 'John',
        lastName: 'Driver',
        role: 'DRIVER',
        status: 'ACTIVE',
        phone: '+1-555-0101',
        verified: true,
      },
      {
        email: 'courier@delivery.com',
        password: await bcrypt.hash('Courier@2024!', 10),
        firstName: 'Maria',
        lastName: 'Courier',
        role: 'COURIER',
        status: 'ACTIVE',
        phone: '+1-555-0201',
        verified: true,
      },
      {
        email: 'merchant@delivery.com',
        password: await bcrypt.hash('Merchant@2024!', 10),
        firstName: 'Carlos',
        lastName: 'Merchant',
        role: 'MERCHANT',
        status: 'ACTIVE',
        phone: '+1-555-0301',
        verified: true,
      },
      {
        email: 'customer@delivery.com',
        password: await bcrypt.hash('Customer@2024!', 10),
        firstName: 'Ana',
        lastName: 'Customer',
        role: 'CUSTOMER',
        status: 'ACTIVE',
        phone: '+1-555-0401',
        verified: true,
      },
    ];

    // Insert in identity_users table
    const result = await queryRunner.manager.query(`
      INSERT INTO identity_users (email, password, "firstName", "lastName", role, status, phone, verified, "createdAt", "updatedAt")
      VALUES ${users.map((_, i) => `($${i * 8 + 1}, $${i * 8 + 2}, $${i * 8 + 3}, $${i * 8 + 4}, $${i * 8 + 5}, $${i * 8 + 6}, $${i * 8 + 7}, $${i * 8 + 8}, NOW(), NOW())`).join(',')}
      RETURNING id, email;
    `, users.flatMap(u => [u.email, u.password, u.firstName, u.lastName, u.role, u.status, u.phone, u.verified]));

    console.log(`   Created ${result.length} identity users`);
  } finally {
    await queryRunner.release();
  }
}
