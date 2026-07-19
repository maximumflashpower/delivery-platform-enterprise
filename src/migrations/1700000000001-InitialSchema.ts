import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000001 implements MigrationInterface {
  name = 'InitialSchema1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`
      CREATE TABLE "identity_users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "phone" varchar(20),
        "firstName" varchar(100) NOT NULL,
        "lastName" varchar(100) NOT NULL,
        "email" varchar(255),
        "displayName" varchar(100) NOT NULL DEFAULT '',
        "status" varchar(50) NOT NULL DEFAULT 'active',
        "emailVerifiedAt" TIMESTAMP,
        "phoneVerifiedAt" TIMESTAMP,
        "lastLoginAt" TIMESTAMP,
        "avatarUrl" text,
        "timezone" varchar(50),
        "language" varchar(10),
        CONSTRAINT "PK_identity_users" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`CREATE INDEX "idx_identity_users_phone" ON "identity_users" ("phone");`);
    await queryRunner.query(`CREATE INDEX "idx_identity_users_email" ON "identity_users" ("email");`);

    await queryRunner.query(`
      CREATE TABLE "identity_sessions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid NOT NULL,
        "refreshTokenHash" varchar(255) NOT NULL,
        "userAgent" varchar(100),
        "ipAddress" inet NOT NULL,
        "expiresAt" TIMESTAMP,
        "isActive" boolean NOT NULL DEFAULT true,
        "revokedAt" TIMESTAMP,
        "revokeReason" varchar(50),
        CONSTRAINT "PK_identity_sessions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_identity_sessions_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "identity_devices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid NOT NULL,
        "deviceId" varchar(255) NOT NULL,
        "deviceType" varchar(100) NOT NULL,
        "deviceName" varchar(255),
        "isTrusted" boolean NOT NULL DEFAULT true,
        "lastUsedAt" TIMESTAMP,
        CONSTRAINT "PK_identity_devices" PRIMARY KEY ("id"),
        CONSTRAINT "FK_identity_devices_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "identity_recovery_codes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid NOT NULL,
        "codeHash" varchar(100) NOT NULL,
        "method" varchar(50) NOT NULL,
        "isUsed" boolean NOT NULL DEFAULT false,
        "usedAt" TIMESTAMP,
        "expiresAt" TIMESTAMP,
        CONSTRAINT "PK_identity_recovery_codes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_identity_recovery_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "identity_verifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid NOT NULL,
        "verificationType" varchar(50) NOT NULL,
        "value" varchar(255) NOT NULL,
        "status" varchar(50) NOT NULL,
        "provider" varchar(50) NOT NULL,
        "token" varchar(255),
        "verifiedAt" TIMESTAMP,
        "expiresAt" TIMESTAMP,
        CONSTRAINT "PK_identity_verifications" PRIMARY KEY ("id"),
        CONSTRAINT "FK_identity_verifications_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "credentials" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid NOT NULL,
        "type" varchar(50) NOT NULL,
        "identifier" varchar(255) NOT NULL,
        "secretHash" varchar(255),
        "status" varchar(50) NOT NULL DEFAULT 'active',
        "lastUsedAt" TIMESTAMP,
        "expiresAt" TIMESTAMP,
        "failedAttempts" integer NOT NULL DEFAULT 0,
        "lockedUntil" TIMESTAMP,
        CONSTRAINT "PK_credentials" PRIMARY KEY ("id"),
        CONSTRAINT "FK_credentials_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`CREATE INDEX "idx_credentials_identifier" ON "credentials" ("identifier", "type");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "credentials";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "identity_verifications";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "identity_recovery_codes";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "identity_devices";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "identity_sessions";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "identity_users";`);
  }
}
