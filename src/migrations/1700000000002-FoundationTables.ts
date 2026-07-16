import { MigrationInterface, QueryRunner } from 'typeorm';

export class FoundationTables1700000000002 implements MigrationInterface {
  name = 'FoundationTables1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // === ROLE-PROFILE ===
    await queryRunner.query(`
      CREATE TABLE "identity_roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "name" varchar(100) NOT NULL UNIQUE,
        "description" varchar(255) NOT NULL,
        "level" varchar(50) NOT NULL,
        "permissions" text[] NOT NULL DEFAULT '{}',
        "isActive" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_identity_roles" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "user_profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid NOT NULL,
        "type" varchar(50) NOT NULL DEFAULT 'individual',
        "status" varchar(50) NOT NULL DEFAULT 'active',
        "bio" text,
        "website" varchar(255),
        "location" varchar(255),
        "metadata" jsonb,
        CONSTRAINT "PK_user_profiles" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_profiles_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "identity_user_roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid NOT NULL,
        "roleId" uuid NOT NULL,
        "assignedAt" TIMESTAMP NOT NULL,
        "assignedBy" varchar(100),
        CONSTRAINT "PK_identity_user_roles" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_roles_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_roles_role" FOREIGN KEY ("roleId") REFERENCES "identity_roles"("id") ON DELETE CASCADE
      );
    `);

    // === TRUST-SAFETY ===
    await queryRunner.query(`
      CREATE TABLE "trust_verification_badges" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid NOT NULL,
        "badgeType" varchar(50) NOT NULL,
        "level" varchar(50) NOT NULL,
        "awardedAt" TIMESTAMP NOT NULL,
        "expiresAt" TIMESTAMP,
        "awardedReason" varchar(255),
        CONSTRAINT "PK_trust_badges" PRIMARY KEY ("id"),
        CONSTRAINT "FK_trust_badges_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "trust_scores" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid NOT NULL,
        "score" integer NOT NULL DEFAULT 50,
        "trend" varchar(50) NOT NULL,
        "calculatedAt" TIMESTAMP NOT NULL,
        "factors" jsonb,
        CONSTRAINT "PK_trust_scores" PRIMARY KEY ("id"),
        CONSTRAINT "FK_trust_scores_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "trust_incidents" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "reportedUserId" uuid,
        "reporterId" uuid,
        "category" varchar(100) NOT NULL,
        "severity" varchar(50) NOT NULL,
        "description" text NOT NULL,
        "status" varchar(50) NOT NULL DEFAULT 'open',
        "resolvedAt" TIMESTAMP,
        "resolutionNotes" text,
        CONSTRAINT "PK_trust_incidents" PRIMARY KEY ("id"),
        CONSTRAINT "FK_trust_incidents_reported" FOREIGN KEY ("reportedUserId") REFERENCES "identity_users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_trust_incidents_reporter" FOREIGN KEY ("reporterId") REFERENCES "identity_users"("id") ON DELETE SET NULL
      );
    `);

    // === FINANCIAL-LEDGER ===
    await queryRunner.query(`
      CREATE TABLE "financial_accounts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "accountNumber" varchar(100) NOT NULL UNIQUE,
        "name" varchar(255) NOT NULL,
        "type" varchar(50) NOT NULL,
        "currency" varchar(10) NOT NULL DEFAULT 'MXN',
        "balance" decimal(19,4) NOT NULL DEFAULT 0,
        "status" varchar(50) NOT NULL DEFAULT 'active',
        "description" text,
        CONSTRAINT "PK_financial_accounts" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`CREATE INDEX "idx_financial_accounts_number" ON "financial_accounts" ("accountNumber");`);

    await queryRunner.query(`
      CREATE TABLE "financial_journal_entries" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "entryNumber" varchar(100) NOT NULL,
        "entryDate" date NOT NULL,
        "description" varchar(255) NOT NULL,
        "reference" varchar(50),
        "status" varchar(50) NOT NULL DEFAULT 'posted',
        CONSTRAINT "PK_financial_journal_entries" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`CREATE INDEX "idx_journal_entries_date" ON "financial_journal_entries" ("entryDate");`);

    await queryRunner.query(`
      CREATE TABLE "financial_journal_lines" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "entryId" uuid NOT NULL,
        "accountId" uuid NOT NULL,
        "type" varchar(50) NOT NULL,
        "amount" decimal(19,4) NOT NULL,
        "description" varchar(255),
        "reference" varchar(100),
        CONSTRAINT "PK_financial_journal_lines" PRIMARY KEY ("id"),
        CONSTRAINT "FK_journal_lines_entry" FOREIGN KEY ("entryId") REFERENCES "financial_journal_entries"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`CREATE INDEX "idx_journal_lines_entry" ON "financial_journal_lines" ("entryId");`);

    // === PAYOUT ===
    await queryRunner.query(`
      CREATE TABLE "payouts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "payoutId" varchar(100) NOT NULL UNIQUE,
        "userId" uuid,
        "amount" decimal(19,4) NOT NULL,
        "currency" varchar(10) NOT NULL,
        "method" varchar(50) NOT NULL,
        "status" varchar(50) NOT NULL,
        "notes" text,
        CONSTRAINT "PK_payouts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_payouts_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE SET NULL
      );
    `);

    // === VEHICLE-CAPABILITY ===
    await queryRunner.query(`
      CREATE TABLE "vehicles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "plateNumber" varchar(50) NOT NULL UNIQUE,
        "ownerId" uuid,
        "model" varchar(100) NOT NULL,
        "type" varchar(50) NOT NULL,
        "color" varchar(20),
        "status" varchar(50) NOT NULL DEFAULT 'available',
        "capacity" jsonb,
        CONSTRAINT "PK_vehicles" PRIMARY KEY ("id"),
        CONSTRAINT "FK_vehicles_owner" FOREIGN KEY ("ownerId") REFERENCES "identity_users"("id") ON DELETE SET NULL
      );
    `);

    // === MOBILITY-RIDE ===
    await queryRunner.query(`
      CREATE TABLE "rides" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "rideId" varchar(100) NOT NULL UNIQUE,
        "passengerId" uuid,
        "driverId" uuid,
        "type" varchar(50) NOT NULL,
        "status" varchar(50) NOT NULL,
        "fare" decimal(19,4),
        "locations" jsonb,
        CONSTRAINT "PK_rides" PRIMARY KEY ("id"),
        CONSTRAINT "FK_rides_passenger" FOREIGN KEY ("passengerId") REFERENCES "identity_users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_rides_driver" FOREIGN KEY ("driverId") REFERENCES "identity_users"("id") ON DELETE SET NULL
      );
    `);

    // === SURFACE-ROUTING ===
    await queryRunner.query(`
      CREATE TABLE "routes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "routeId" varchar(100) NOT NULL UNIQUE,
        "waypoints" jsonb NOT NULL,
        "distanceKm" decimal(10,6),
        "estimatedDurationSeconds" integer,
        "optimizationMode" varchar(50) NOT NULL DEFAULT 'optimal',
        CONSTRAINT "PK_routes" PRIMARY KEY ("id")
      );
    `);

    // === ÍNDICES ADICIONALES ===
    await queryRunner.query(`CREATE INDEX "idx_user_profiles_user" ON "user_profiles" ("userId");`);
    await queryRunner.query(`CREATE INDEX "idx_user_roles_user" ON "identity_user_roles" ("userId");`);
    await queryRunner.query(`CREATE INDEX "idx_user_roles_role" ON "identity_user_roles" ("roleId");`);
    await queryRunner.query(`CREATE INDEX "idx_trust_badges_user" ON "trust_verification_badges" ("userId");`);
    await queryRunner.query(`CREATE INDEX "idx_trust_scores_user" ON "trust_scores" ("userId");`);
    await queryRunner.query(`CREATE INDEX "idx_payouts_user" ON "payouts" ("userId");`);
    await queryRunner.query(`CREATE INDEX "idx_vehicles_owner" ON "vehicles" ("ownerId");`);
    await queryRunner.query(`CREATE INDEX "idx_rides_passenger" ON "rides" ("passengerId");`);
    await queryRunner.query(`CREATE INDEX "idx_rides_driver" ON "rides" ("driverId");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_rides_driver";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_rides_passenger";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_vehicles_owner";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_payouts_user";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_trust_scores_user";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_trust_badges_user";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_user_roles_role";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_user_roles_user";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_user_profiles_user";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "routes";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "rides";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vehicles";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payouts";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_journal_lines_entry";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "financial_journal_lines";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_journal_entries_date";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "financial_journal_entries";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_financial_accounts_number";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "financial_accounts";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "trust_incidents";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "trust_scores";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "trust_verification_badges";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "identity_user_roles";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_profiles";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "identity_roles";`);
  }
}
