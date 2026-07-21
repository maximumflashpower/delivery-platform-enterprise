import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appeal } from './entities/appeal.entity';
import { VictimSupportCase } from './entities/victim-support-case.entity';
import { AppealEvidence } from './entities/appeal-evidence.entity';
import { AppealService } from './services/appeal.service';
import { VictimCaseService } from './services/victim-case.service';
import { AppealEvidenceService } from './services/appeal-evidence.service';
import { AppealController } from './controllers/appeal.controller';
import { VictimCaseController } from './controllers/victim-case.controller';
import { AppealEvidenceController } from './controllers/appeal-evidence.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appeal,
      VictimSupportCase,
      AppealEvidence,
    ]),
  ],
  controllers: [
    AppealController,
    VictimCaseController,
    AppealEvidenceController,
  ],
  providers: [
    AppealService,
    VictimCaseService,
    AppealEvidenceService,
  ],
  exports: [
    AppealService,
    VictimCaseService,
    AppealEvidenceService,
  ],
})
export class SupportClaimsModule {}
