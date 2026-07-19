import { MigrationInterface, QueryRunner } from 'typeorm';

export class DomainTables1700000000003 implements MigrationInterface {
  name = 'DomainTables1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // === DELIVERY-COURIER ===
    await queryRunner.query(`
      CREATE TABLE "domain_couriers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid,
        "courierCode" varchar(100) NOT NULL UNIQUE,
        "status" varchar(50) NOT NULL DEFAULT 'active',
        "rating" decimal(5,2) NOT NULL DEFAULT 0,
        "totalDeliveries" integer NOT NULL DEFAULT 0,
        "isAvailable" boolean NOT NULL DEFAULT true,
        "serviceAreas" jsonb,
        CONSTRAINT "PK_domain_couriers" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_couriers_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_delivery_batches" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "batchNumber" varchar(100) NOT NULL UNIQUE,
        "courierId" uuid,
        "status" varchar(50) NOT NULL DEFAULT 'pending',
        "totalItems" integer NOT NULL DEFAULT 0,
        "completedItems" integer NOT NULL DEFAULT 0,
        "totalDistanceKm" decimal(10,4),
        CONSTRAINT "PK_domain_delivery_batches" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_batches_courier" FOREIGN KEY ("courierId") REFERENCES "domain_couriers"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_courier_assignments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "courierId" uuid NOT NULL,
        "rideId" uuid,
        "routeId" uuid,
        "status" varchar(50) NOT NULL DEFAULT 'assigned',
        "assignedAt" TIMESTAMP,
        "completedAt" TIMESTAMP,
        CONSTRAINT "PK_domain_courier_assignments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_assignments_courier" FOREIGN KEY ("courierId") REFERENCES "domain_couriers"("id") ON DELETE CASCADE
      );
    `);

    // === DRIVER-OPERATOR ===
    await queryRunner.query(`
      CREATE TABLE "domain_drivers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid,
        "driverCode" varchar(100) NOT NULL UNIQUE,
        "status" varchar(50) NOT NULL DEFAULT 'active',
        "backgroundCheckId" varchar(255),
        "backgroundCheckExpiry" date,
        "rating" decimal(5,2) NOT NULL DEFAULT 0,
        "totalTrips" integer NOT NULL DEFAULT 0,
        "isAvailable" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_domain_drivers" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_drivers_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_driver_licenses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "driverId" uuid NOT NULL,
        "licenseNumber" varchar(100) NOT NULL,
        "licenseClass" varchar(50) NOT NULL,
        "issuingState" varchar(10),
        "issueDate" date NOT NULL,
        "expiryDate" date NOT NULL,
        "status" varchar(50) NOT NULL DEFAULT 'valid',
        CONSTRAINT "PK_domain_driver_licenses" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_licenses_driver" FOREIGN KEY ("driverId") REFERENCES "domain_drivers"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_driver_compliance" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "driverId" uuid NOT NULL,
        "requirement" varchar(100) NOT NULL,
        "status" varchar(50) NOT NULL DEFAULT 'pending_review',
        "verifiedAt" date,
        "expiryDate" date,
        "notes" text,
        CONSTRAINT "PK_domain_driver_compliance" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_compliance_driver" FOREIGN KEY ("driverId") REFERENCES "domain_drivers"("id") ON DELETE CASCADE
      );
    `);

    // === MERCHANT-B2B ===
    await queryRunner.query(`
      CREATE TABLE "domain_merchants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "ownerId" uuid,
        "merchantCode" varchar(100) NOT NULL UNIQUE,
        "legalName" varchar(255) NOT NULL,
        "tradeName" varchar(255) NOT NULL,
        "taxId" varchar(20),
        "status" varchar(50) NOT NULL DEFAULT 'pending',
        "tier" varchar(50) NOT NULL DEFAULT 'bronze',
        "businessAddress" jsonb,
        CONSTRAINT "PK_domain_merchants" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_merchants_owner" FOREIGN KEY ("ownerId") REFERENCES "identity_users"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_merchant_contracts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "merchantId" uuid NOT NULL,
        "contractNumber" varchar(100) NOT NULL UNIQUE,
        "startDate" date NOT NULL,
        "endDate" date NOT NULL,
        "status" varchar(50) NOT NULL DEFAULT 'draft',
        "commissionRate" decimal(5,2) NOT NULL DEFAULT 0,
        "terms" jsonb,
        CONSTRAINT "PK_domain_merchant_contracts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_contracts_merchant" FOREIGN KEY ("merchantId") REFERENCES "domain_merchants"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_merchant_invoices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "merchantId" uuid NOT NULL,
        "invoiceNumber" varchar(100) NOT NULL UNIQUE,
        "issueDate" date NOT NULL,
        "dueDate" date,
        "amount" decimal(19,4) NOT NULL,
        "currency" varchar(10) NOT NULL DEFAULT 'MXN',
        "status" varchar(50) NOT NULL DEFAULT 'draft',
        "paidDate" date,
        CONSTRAINT "PK_domain_merchant_invoices" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_invoices_merchant" FOREIGN KEY ("merchantId") REFERENCES "domain_merchants"("id") ON DELETE CASCADE
      );
    `);

    // === LOCAL-SERVICES ===
    await queryRunner.query(`
      CREATE TABLE "domain_service_categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "name" varchar(100) NOT NULL UNIQUE,
        "slug" varchar(50) NOT NULL UNIQUE,
        "description" text,
        "iconUrl" varchar(255),
        "isActive" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_domain_service_categories" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_service_providers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid,
        "providerCode" varchar(100) NOT NULL UNIQUE,
        "displayName" varchar(255) NOT NULL,
        "status" varchar(50) NOT NULL DEFAULT 'offline',
        "skillLevel" varchar(50) NOT NULL DEFAULT 'junior',
        "rating" decimal(5,2) NOT NULL DEFAULT 0,
        "totalBookings" integer NOT NULL DEFAULT 0,
        "serviceAreas" jsonb,
        "categories" jsonb,
        CONSTRAINT "PK_domain_service_providers" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_providers_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_service_bookings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "bookingCode" varchar(100) NOT NULL UNIQUE,
        "providerId" uuid,
        "customerId" uuid,
        "categoryId" uuid,
        "serviceName" varchar(255) NOT NULL,
        "scheduledAt" TIMESTAMP NOT NULL,
        "durationMinutes" integer,
        "quotedPrice" decimal(19,4),
        "status" varchar(50) NOT NULL DEFAULT 'pending',
        "location" jsonb,
        "notes" text,
        CONSTRAINT "PK_domain_service_bookings" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_bookings_provider" FOREIGN KEY ("providerId") REFERENCES "domain_service_providers"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_domain_bookings_customer" FOREIGN KEY ("customerId") REFERENCES "identity_users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_domain_bookings_category" FOREIGN KEY ("categoryId") REFERENCES "domain_service_categories"("id") ON DELETE SET NULL
      );
    `);

    // === HAULING-MOVING ===
    await queryRunner.query(`
      CREATE TABLE "domain_haulers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid,
        "haulerCode" varchar(100) NOT NULL UNIQUE,
        "companyName" varchar(255) NOT NULL,
        "status" varchar(50) NOT NULL DEFAULT 'active',
        "rating" decimal(5,2) NOT NULL DEFAULT 0,
        "totalJobs" integer NOT NULL DEFAULT 0,
        "serviceAreas" jsonb,
        "equipmentTypes" jsonb,
        CONSTRAINT "PK_domain_haulers" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_haulers_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_loads" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "loadNumber" varchar(100) NOT NULL UNIQUE,
        "haulerId" uuid,
        "status" varchar(50) NOT NULL DEFAULT 'pickup_pending',
        "pickupLocation" jsonb NOT NULL,
        "deliveryLocation" jsonb NOT NULL,
        "weightKg" decimal(10,2),
        "volumeM3" decimal(10,2),
        "items" jsonb,
        "pickedUpAt" TIMESTAMP,
        "deliveredAt" TIMESTAMP,
        CONSTRAINT "PK_domain_loads" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_loads_hauler" FOREIGN KEY ("haulerId") REFERENCES "domain_haulers"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_moving_requests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "requestCode" varchar(100) NOT NULL UNIQUE,
        "customerId" uuid,
        "haulerId" uuid,
        "status" varchar(50) NOT NULL DEFAULT 'submitted',
        "originAddress" jsonb NOT NULL,
        "destinationAddress" jsonb NOT NULL,
        "movingDate" date NOT NULL,
        "estimatedVolumeM3" integer,
        "quotedPrice" decimal(19,4),
        "notes" text,
        CONSTRAINT "PK_domain_moving_requests" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_moving_customer" FOREIGN KEY ("customerId") REFERENCES "identity_users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_domain_moving_hauler" FOREIGN KEY ("haulerId") REFERENCES "domain_haulers"("id") ON DELETE SET NULL
      );
    `);

    // === HOST-TRAVEL ===
    await queryRunner.query(`
      CREATE TABLE "domain_hosts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid,
        "hostCode" varchar(100) NOT NULL UNIQUE,
        "displayName" varchar(255) NOT NULL,
        "status" varchar(50) NOT NULL DEFAULT 'pending_verification',
        "rating" decimal(5,2) NOT NULL DEFAULT 0,
        "totalListings" integer NOT NULL DEFAULT 0,
        "totalReservations" integer NOT NULL DEFAULT 0,
        "isSuperHost" boolean NOT NULL DEFAULT false,
        "responseTime" jsonb,
        CONSTRAINT "PK_domain_hosts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_hosts_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_listings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "hostId" uuid NOT NULL,
        "listingCode" varchar(100) NOT NULL UNIQUE,
        "title" varchar(255) NOT NULL,
        "description" text,
        "propertyType" varchar(50) NOT NULL DEFAULT 'entire_home',
        "status" varchar(50) NOT NULL DEFAULT 'under_review',
        "nightlyPrice" decimal(19,4) NOT NULL DEFAULT 0,
        "currency" varchar(10) NOT NULL DEFAULT 'MXN',
        "maxGuests" integer NOT NULL DEFAULT 1,
        "bedrooms" integer NOT NULL DEFAULT 1,
        "bathrooms" integer NOT NULL DEFAULT 1,
        "location" jsonb NOT NULL,
        "amenities" jsonb,
        "photos" jsonb,
        CONSTRAINT "PK_domain_listings" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_listings_host" FOREIGN KEY ("hostId") REFERENCES "domain_hosts"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_reservations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "reservationCode" varchar(100) NOT NULL UNIQUE,
        "listingId" uuid NOT NULL,
        "guestId" uuid,
        "checkInDate" date NOT NULL,
        "checkOutDate" date NOT NULL,
        "guestCount" integer NOT NULL DEFAULT 1,
        "totalPrice" decimal(19,4) NOT NULL,
        "currency" varchar(10) NOT NULL DEFAULT 'MXN',
        "status" varchar(50) NOT NULL DEFAULT 'pending',
        "checkedInAt" TIMESTAMP,
        "checkedOutAt" TIMESTAMP,
        "specialRequests" text,
        CONSTRAINT "PK_domain_reservations" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_reservations_listing" FOREIGN KEY ("listingId") REFERENCES "domain_listings"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_domain_reservations_guest" FOREIGN KEY ("guestId") REFERENCES "identity_users"("id") ON DELETE SET NULL
      );
    `);

    // === FREIGHT-TRUCKING ===
    await queryRunner.query(`
      CREATE TABLE "domain_carriers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid,
        "carrierCode" varchar(100) NOT NULL UNIQUE,
        "companyName" varchar(255) NOT NULL,
        "mcNumber" varchar(20),
        "dotNumber" varchar(20),
        "status" varchar(50) NOT NULL DEFAULT 'pending_verification',
        "rating" decimal(5,2) NOT NULL DEFAULT 0,
        "totalShipments" integer NOT NULL DEFAULT 0,
        "serviceRegions" jsonb,
        "equipmentTypes" jsonb,
        CONSTRAINT "PK_domain_carriers" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_carriers_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_shipments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "shipmentNumber" varchar(100) NOT NULL UNIQUE,
        "carrierId" uuid,
        "status" varchar(50) NOT NULL DEFAULT 'booked',
        "cargoType" varchar(50) NOT NULL DEFAULT 'dry_freight',
        "pickupLocation" jsonb NOT NULL,
        "deliveryLocation" jsonb NOT NULL,
        "pickupDateTime" TIMESTAMP NOT NULL,
        "deliveryDateTime" TIMESTAMP,
        "weightKg" decimal(10,2),
        "freightCharge" decimal(19,4),
        "currency" varchar(10) NOT NULL DEFAULT 'USD',
        "proofOfDelivery" jsonb,
        CONSTRAINT "PK_domain_shipments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_shipments_carrier" FOREIGN KEY ("carrierId") REFERENCES "domain_carriers"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_bills_of_lading" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "shipmentId" uuid NOT NULL,
        "bolNumber" varchar(100) NOT NULL UNIQUE,
        "issueDate" date NOT NULL,
        "shipperInfo" jsonb NOT NULL,
        "consigneeInfo" jsonb NOT NULL,
        "notifyPartyInfo" jsonb,
        "items" jsonb NOT NULL,
        "totalWeightKg" decimal(10,2),
        "specialInstructions" varchar(255),
        "isSigned" boolean NOT NULL DEFAULT false,
        "signedAt" TIMESTAMP,
        "signerName" varchar(255),
        CONSTRAINT "PK_domain_bills_of_lading" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_bol_shipment" FOREIGN KEY ("shipmentId") REFERENCES "domain_shipments"("id") ON DELETE CASCADE
      );
    `);

    // === SCHEDULING ===
    await queryRunner.query(`
      CREATE TABLE "domain_jobs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "jobCode" varchar(100) NOT NULL UNIQUE,
        "name" varchar(255) NOT NULL,
        "status" varchar(50) NOT NULL DEFAULT 'pending',
        "priority" varchar(50) NOT NULL DEFAULT 'medium',
        "jobType" varchar(255) NOT NULL,
        "payload" jsonb,
        "scheduledAt" TIMESTAMP,
        "startedAt" TIMESTAMP,
        "completedAt" TIMESTAMP,
        "retryCount" integer NOT NULL DEFAULT 0,
        "errorMessage" text,
        "metadata" jsonb,
        CONSTRAINT "PK_domain_jobs" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_schedules" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "scheduleCode" varchar(100) NOT NULL UNIQUE,
        "name" varchar(255) NOT NULL,
        "description" varchar(255) NOT NULL,
        "cronExpression" varchar(255) NOT NULL,
        "recurrencePattern" varchar(50) NOT NULL DEFAULT 'once',
        "jobType" varchar(255) NOT NULL,
        "jobPayload" jsonb,
        "isActive" boolean NOT NULL DEFAULT true,
        "timezone" varchar(255),
        "exceptions" jsonb,
        "lastRunAt" TIMESTAMP,
        "nextRunAt" TIMESTAMP,
        CONSTRAINT "PK_domain_schedules" PRIMARY KEY ("id")
      );
    `);

    // === SEARCH ===
    await queryRunner.query(`
      CREATE TABLE "domain_search_index_jobs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "jobCode" varchar(100) NOT NULL UNIQUE,
        "status" varchar(50) NOT NULL DEFAULT 'pending',
        "entityType" varchar(50) NOT NULL,
        "entityId" uuid NOT NULL,
        "indexedData" jsonb,
        "indexedAt" TIMESTAMP,
        "errorMessage" text,
        "retryCount" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_domain_search_index_jobs" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_search_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid,
        "query" varchar(255) NOT NULL,
        "entityType" varchar(50),
        "filters" jsonb,
        "resultsCount" integer,
        "page" integer NOT NULL DEFAULT 1,
        "pageSize" integer NOT NULL DEFAULT 20,
        "durationMs" decimal(10,6) NOT NULL DEFAULT 0,
        "sessionId" varchar(100),
        "clickResults" jsonb,
        CONSTRAINT "PK_domain_search_logs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_search_logs_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE SET NULL
      );
    `);

    // === SUPPORT-CLAIMS ===
    await queryRunner.query(`
      CREATE TABLE "domain_claims" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "claimNumber" varchar(100) NOT NULL UNIQUE,
        "userId" uuid,
        "status" varchar(50) NOT NULL DEFAULT 'open',
        "priority" varchar(50) NOT NULL DEFAULT 'medium',
        "category" varchar(50) NOT NULL DEFAULT 'other',
        "subject" varchar(255) NOT NULL,
        "description" text NOT NULL,
        "relatedEntityId" uuid,
        "relatedEntityType" varchar(50),
        "assignedToUserId" uuid,
        "openedAt" TIMESTAMP,
        "respondedAt" TIMESTAMP,
        "resolvedAt" TIMESTAMP,
        "resolutionNotes" text,
        CONSTRAINT "PK_domain_claims" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_claims_user" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_domain_claims_assigned" FOREIGN KEY ("assignedToUserId") REFERENCES "identity_users"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_claim_tickets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "claimId" uuid NOT NULL,
        "authorType" varchar(50) NOT NULL DEFAULT 'customer',
        "authorId" uuid,
        "message" text NOT NULL,
        "attachments" jsonb,
        "isInternal" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_domain_claim_tickets" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_tickets_claim" FOREIGN KEY ("claimId") REFERENCES "domain_claims"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_claim_status_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "claimId" uuid NOT NULL,
        "previousStatus" varchar(50) NOT NULL,
        "newStatus" varchar(50) NOT NULL,
        "changedByUserId" uuid,
        "changedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "reason" text,
        CONSTRAINT "PK_domain_claim_status_logs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_domain_status_logs_claim" FOREIGN KEY ("claimId") REFERENCES "domain_claims"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "domain_sla_configs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "category" varchar(50) NOT NULL DEFAULT 'other',
        "priority" varchar(50) NOT NULL DEFAULT 'medium',
        "responseTimeHours" integer NOT NULL DEFAULT 24,
        "resolutionTimeHours" integer NOT NULL DEFAULT 72,
        "escalationDelayHours" integer NOT NULL DEFAULT 2,
        "escalationEmail" varchar(255),
        "isActive" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_domain_sla_configs" PRIMARY KEY ("id")
      );
    `);

    // === INDICES ===
    await queryRunner.query(`CREATE INDEX "idx_domain_couriers_user" ON "domain_couriers" ("userId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_courier_assignments_courier" ON "domain_courier_assignments" ("courierId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_drivers_user" ON "domain_drivers" ("userId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_licenses_driver" ON "domain_driver_licenses" ("driverId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_compliance_driver" ON "domain_driver_compliance" ("driverId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_merchants_owner" ON "domain_merchants" ("ownerId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_contracts_merchant" ON "domain_merchant_contracts" ("merchantId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_invoices_merchant" ON "domain_merchant_invoices" ("merchantId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_providers_user" ON "domain_service_providers" ("userId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_bookings_provider" ON "domain_service_bookings" ("providerId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_bookings_customer" ON "domain_service_bookings" ("customerId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_haulers_user" ON "domain_haulers" ("userId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_loads_hauler" ON "domain_loads" ("haulerId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_moving_customer" ON "domain_moving_requests" ("customerId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_moving_hauler" ON "domain_moving_requests" ("haulerId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_hosts_user" ON "domain_hosts" ("userId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_listings_host" ON "domain_listings" ("hostId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_reservations_listing" ON "domain_reservations" ("listingId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_reservations_guest" ON "domain_reservations" ("guestId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_carriers_user" ON "domain_carriers" ("userId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_shipments_carrier" ON "domain_shipments" ("carrierId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_bol_shipment" ON "domain_bills_of_lading" ("shipmentId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_search_logs_user" ON "domain_search_logs" ("userId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_claims_user" ON "domain_claims" ("userId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_claims_assigned" ON "domain_claims" ("assignedToUserId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_tickets_claim" ON "domain_claim_tickets" ("claimId");`);
    await queryRunner.query(`CREATE INDEX "idx_domain_status_logs_claim" ON "domain_claim_status_logs" ("claimId");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indices
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_status_logs_claim";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_tickets_claim";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_claims_assigned";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_claims_user";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_search_logs_user";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_bol_shipment";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_shipments_carrier";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_carriers_user";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_reservations_guest";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_reservations_listing";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_listings_host";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_hosts_user";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_moving_hauler";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_moving_customer";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_loads_hauler";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_haulers_user";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_bookings_customer";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_bookings_provider";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_providers_user";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_invoices_merchant";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_contracts_merchant";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_merchants_owner";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_compliance_driver";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_licenses_driver";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_drivers_user";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_courier_assignments_courier";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_domain_couriers_user";`);

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_sla_configs";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_claim_status_logs";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_claim_tickets";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_claims";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_search_logs";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_search_index_jobs";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_schedules";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_jobs";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_bills_of_lading";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_shipments";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_carriers";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_reservations";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_listings";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_hosts";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_moving_requests";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_loads";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_haulers";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_service_bookings";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_service_providers";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_service_categories";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_merchant_invoices";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_merchant_contracts";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_merchants";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_driver_compliance";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_driver_licenses";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_drivers";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_courier_assignments";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_delivery_batches";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domain_couriers";`);
  }
}
