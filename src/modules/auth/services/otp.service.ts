import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdentityVerification } from '../../identity/entities/identity-verification.entity';
import { VerificationStatus } from '../../identity/enums/verification-status.enum';
import { IdentityProvider } from '../../identity/enums/identity-provider.enum';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly isDev: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(IdentityVerification)
    private readonly verificationRepo: Repository<IdentityVerification>,
  ) {
    this.isDev = process.env.NODE_ENV === 'development';
  }

  async generateAndSend(userId: string, phone: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const verification = this.verificationRepo.create({
      userId,
      verificationType: 'PHONE_OTP',
      value: phone,
      status: VerificationStatus.PENDING,
      provider: IdentityProvider.TWILIO,
      token: code,
      expiresAt,
    });

    await this.verificationRepo.save(verification);

    if (this.isDev) {
      this.logger.log(`[DEV OTP] Phone: ${phone} | Code: ${code}`);
      return code;
    }

    // TODO: Send via Twilio in production
    await this.sendViaTwilio(phone, code);
    return '';
  }

  async verify(phone: string, code: string): Promise<boolean> {
    const verification = await this.verificationRepo.findOne({
      where: {
        value: phone,
        token: code,
        status: VerificationStatus.PENDING,
      },
      order: { createdAt: 'DESC' },
    });

    if (!verification) return false;
    if (verification.expiresAt && verification.expiresAt < new Date()) return false;

    verification.status = VerificationStatus.VERIFIED;
    verification.verifiedAt = new Date();
    await this.verificationRepo.save(verification);

    return true;
  }

  private async sendViaTwilio(phone: string, code: string): Promise<void> {
    this.logger.log(`[TWILIO] Sending OTP to ${phone}`);
    // TODO: Implement real Twilio integration
  }
}
