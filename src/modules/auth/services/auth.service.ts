import { Injectable, ConflictException, UnauthorizedException, NotFoundException, Logger } from '@nestjs/common';
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
    const existing = await this.userRepo.findOne({ where: { phone: dto.phone } });
    if (existing) throw new ConflictException('Phone number already registered');

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
    const credential = await this.credentialRepo.findOne({
      where: { identifier: dto.identifier, type: CredentialType.PASSWORD },
      relations: ['user'],
    });

    if (!credential || !credential.secretHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (credential.status === CredentialStatus.LOCKED) {
      throw new UnauthorizedException('Account locked');
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
      throw new UnauthorizedException('Account not active');
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
}
