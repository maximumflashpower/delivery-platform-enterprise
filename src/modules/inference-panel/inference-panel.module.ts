import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InferencePanelController } from './controllers/inference-panel.controller';
import { InferencePanelService } from './services/inference-panel.service';
import { InferenceLog } from './entities/inference-log.entity';
import { PrivacyBudget } from './entities/privacy-budget.entity';
import { PrivacyBudgetTransaction } from './entities/privacy-budget-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InferenceLog, PrivacyBudget, PrivacyBudgetTransaction])],
  controllers: [InferencePanelController],
  providers: [InferencePanelService],
  exports: [InferencePanelService],
})
export class InferencePanelModule {}
