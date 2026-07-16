import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { License } from './entities/license.entity';
import { Compliance } from './entities/compliance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Driver, License, Compliance])],
  exports: [TypeOrmModule],
})
export class DriverOperatorModule {}
