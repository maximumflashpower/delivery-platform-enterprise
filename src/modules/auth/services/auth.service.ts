import { Injectable, ConflictException, UnauthorizedException, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { IdentityVerification } from '../../identity/entities/identity-verification.entity';
import { Credential } from '../entities/credential.entity';
import { CredentialType } from '../enums/credential-type.enum';
import { CredentialStatus } from '../enums/credential-status.enum';
import { AccountStatus } from '../../identity/enums/account-status.enum';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { TokenService, JwtPayload } from './token.service';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(IdentityUser)
    private readonly userRepo: Repository<IdentityUser>,
    @InjectRepository(Credential)
    private readonly credentialRepo: Repository<Credential>,
    @InjectRepository(IdentityVerification)
    private readonly verificationRepo: Repository<IdentityVerification>,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: [{ phone: dto.phone }, { email: dto.email }] });
    if (existing) {
      if (existing.phone === dto.phone) throw new ConflictException('Phone number already registered');
      if (existing.email === dto.email) throw new ConflictException('Email already registered');
    }

    const user = this.userRepo.create({
      phone: dto.phone,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      displayName: `${dto.firstName} ${dto.lastName}`,
      status: AccountStatus.PENDING_VERIFICATION,
    });
    await this.userRepo.save(user);

    if (dto.password) {
      const secretHash = await bcrypt.hash(dto.password, 10);
      const credential = this.credentialRepo.create({
        userId: user.id,
        type: CredentialType.PASSWORD,
        identifier: dto.phone,
        secretHash,
        status: CredentialStatus.ACTIVE,
      });
      await this.credentialRepo.save(credential);
    }

    const devOtp = await this.otpService.generateAndSend(user.id, dto.phone);

    return {
      userId: user.id,
      phone: user.phone,
      message: 'Registration successful. Verify your phone number.',
      devOtp: devOtp || undefined,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.userRepo.findOne({ where: { phone: dto.phone } });
    if (!user) throw new NotFoundException('User not found');

    const isValid = await this.otpService.verify(dto.phone, dto.otp);
    if (!isValid) throw new UnauthorizedException('Invalid or expired OTP');

    user.status = AccountStatus.ACTIVE;
    user.phoneVerifiedAt = new Date();
    user.lastLoginAt = new Date();
    await this.userRepo.save(user);

    const payload: JwtPayload = { sub: user.id, phone: user.phone };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        email: user.email,
      },
    };
  }

  async login(dto: LoginDto) {
    let credential = await this.credentialRepo.findOne({
      where: { identifier: dto.identifier, type: CredentialType.PASSWORD },
      relations: ['user'],
    });

    if (!credential && dto.identifier.includes('@')) {
      const user = await this.userRepo.findOne({ where: { email: dto.identifier } });
      if (user) {
        credential = await this.credentialRepo.findOne({
          where: { userId: user.id, type: CredentialType.PASSWORD },
          relations: ['user'],
        });
      }
    }

    if (!credential || !credential.secretHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (credential.status === CredentialStatus.LOCKED) {
      if (credential.lockedUntil && credential.lockedUntil > new Date()) {
        throw new UnauthorizedException(`Account locked until ${credential.lockedUntil.toISOString()}`);
      }
      credential.status = CredentialStatus.ACTIVE;
      credential.failedAttempts = 0;
      await this.credentialRepo.save(credential);
    }

    const isMatch = await bcrypt.compare(dto.password, credential.secretHash);
    if (!isMatch) {
      credential.failedAttempts += 1;
      if (credential.failedAttempts >= 5) {
        credential.status = CredentialStatus.LOCKED;
        credential.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
      }
      await this.credentialRepo.save(credential);
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = credential.user;
    if (user.status !== AccountStatus.ACTIVE) {
      throw new UnauthorizedException(`Account not active: ${user.status}`);
    }

    credential.failedAttempts = 0;
    credential.lastUsedAt = new Date();
    await this.credentialRepo.save(credential);

    user.lastLoginAt = new Date();
    await this.userRepo.save(user);

    const payload: JwtPayload = { sub: user.id, phone: user.phone };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        email: user.email,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    const payload = this.tokenService.verifyRefreshToken(refreshToken);
    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) throw new NotFoundException('User not found');

    const newPayload: JwtPayload = { sub: user.id, phone: user.phone };
    const accessToken = this.tokenService.generateAccessToken(newPayload);
    const newRefreshToken = this.tokenService.generateRefreshToken(newPayload);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const credential = await this.credentialRepo.findOne({
      where: { userId, type: CredentialType.PASSWORD },
    });

    if (!credential || !credential.secretHash) {
      throw new BadRequestException('No password credential found');
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, credential.secretHash);
    if (!isMatch) throw new UnauthorizedException('Current password is incorrect');

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    credential.secretHash = newHash;
    credential.updatedAt = new Date();
    await this.credentialRepo.save(credential);

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    let user: IdentityUser | null = null;

    if (dto.identifier.includes('@')) {
      user = await this.userRepo.findOne({ where: { email: dto.identifier } });
    } else {
      user = await this.userRepo.findOne({ where: { phone: dto.identifier } });
    }

    if (!user) {
      this.logger.warn(`Password reset attempted for non-existent user: ${dto.identifier}`);
      return { message: 'If the account exists, an OTP has been sent.' };
    }

    await this.otpService.generateAndSend(user.id, user.phone || '');
    return { message: 'If the account exists, an OTP has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const isValid = await this.otpService.verify(dto.identifier, dto.otp);
    if (!isValid) throw new UnauthorizedException('Invalid or expired OTP');

    let user = await this.userRepo.findOne({ where: { phone: dto.identifier } });
    if (!user && dto.identifier.includes('@')) {
      user = await this.userRepo.findOne({ where: { email: dto.identifier } });
    }
    if (!user) throw new NotFoundException('User not found');

    let credential = await this.credentialRepo.findOne({ where: { userId: user.id, type: CredentialType.PASSWORD } });
    
    if (credential) {
      const newHash = await bcrypt.hash(dto.newPassword, 10);
      credential.secretHash = newHash;
      credential.updatedAt = new Date();
      await this.credentialRepo.save(credential);
    } else {
      const secretHash = await bcrypt.hash(dto.newPassword, 10);
      credential = this.credentialRepo.create({
        userId: user.id,
        type: CredentialType.PASSWORD,
        identifier: user.phone || user.email || '',
        secretHash,
        status: CredentialStatus.ACTIVE,
      });
      await this.credentialRepo.save(credential);
    }

    return { message: 'Password reset successfully' };
  }

  async logout(userId: string) {
    await this.verificationRepo.delete({ userId, status: 'pending' });
    return { message: 'Logged out successfully' };
  }

  async getUserById(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return {
      id: user.id,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      email: user.email,
      status: user.status,
    };
  }

  async getMe(userId: string) {
    return this.getUserById(userId);
  }
}
