import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityUser } from './entities/identity-user.entity';
import { IdentitySession } from './entities/identity-session.entity';
import { IdentityDevice } from './entities/identity-device.entity';
import { IdentityRecoveryCode } from './entities/identity-recovery.entity';
import { IdentityVerification } from './entities/identity-verification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IdentityUser,
      IdentitySession,
      IdentityDevice,
      IdentityRecoveryCode,
      IdentityVerification,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class IdentityModule {}
