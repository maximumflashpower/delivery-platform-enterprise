import * as bcrypt from 'bcrypt';

export interface UserSeedData {
  email: string;
  username: string;
  fullName: string;
  role: string;
  status: string;
}

export const usersToSeed: UserSeedData[] = [
  {
    email: 'admin@delivery-platform.com',
    username: 'admin_user',
    fullName: 'System Administrator',
    role: 'ADMIN',
    status: 'ACTIVE',
  },
  {
    email: 'operator@delivery-platform.com',
    username: 'operator_user',
    fullName: 'Platform Operator',
    role: 'OPERATOR',
    status: 'ACTIVE',
  },
  {
    email: 'driver@delivery-platform.com',
    username: 'driver_user',
    fullName: 'Test Driver',
    role: 'DRIVER',
    status: 'ACTIVE',
  },
  {
    email: 'merchant@delivery-platform.com',
    username: 'merchant_user',
    fullName: 'Test Merchant',
    role: 'MERCHANT',
    status: 'ACTIVE',
  },
];

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function generateUserId(): string {
  return crypto.randomUUID();
}
