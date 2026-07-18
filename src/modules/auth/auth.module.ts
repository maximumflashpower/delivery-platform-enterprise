import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { OtpService } from './services/otp.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { IdentityUser } from '../identity/entities/identity-user.entity';
import { IdentityVerification } from '../identity/entities/identity-verification.entity';
import { IdentitySession } from '../identity/entities/identity-session.entity';
import { Credential } from './entities/credential.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback-dev-secret-min-32-chars!!',
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '15m' },
      }),
    }),
    TypeOrmModule.forFeature([IdentityUser, Credential, IdentityVerification, IdentitySession]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, OtpService, JwtStrategy],
  exports: [AuthService, TokenService, JwtModule],
})
export class AuthModule {}
