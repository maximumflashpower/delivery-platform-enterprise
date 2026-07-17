import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { License } from './entities/license.entity';
import { Compliance } from './entities/compliance.entity';
import { DriverService } from './services/driver.service';
import { LicenseService } from './services/license.service';
import { ComplianceService } from './services/compliance.service';
import { DriverController } from './controllers/driver.controller';
import { LicenseController } from './controllers/license.controller';
import { ComplianceController } from './controllers/compliance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Driver, License, Compliance])],
  controllers: [DriverController, LicenseController, ComplianceController],
  providers: [DriverService, LicenseService, ComplianceService],
  exports: [TypeOrmModule, DriverService, LicenseService, ComplianceService],
})
export class DriverOperatorModule {}
