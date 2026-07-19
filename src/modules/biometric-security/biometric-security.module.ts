import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiometricTemplate } from './entities/biometric-template.entity';
import { BiometricVerification } from './entities/biometric-verification.entity';
import { BiometricTemplateService } from './services/biometric-template.service';
import { BiometricTemplateController } from './controllers/biometric-template.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BiometricTemplate, BiometricVerification])],
  controllers: [BiometricTemplateController],
  providers: [BiometricTemplateService],
  exports: [TypeOrmModule],
})
export class BiometricSecurityModule {}
