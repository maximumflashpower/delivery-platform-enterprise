import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiometricTemplate } from './entities/biometric-template.entity';
import { BiometricVerification } from './entities/biometric-verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BiometricTemplate, BiometricVerification])],
  exports: [TypeOrmModule],
})
export class BiometricSecurityModule {}
