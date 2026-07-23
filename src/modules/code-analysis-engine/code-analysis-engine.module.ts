import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScanJob } from './entities/scan-job.entity';
import { DeadCodeFinding } from './entities/dead-code-finding.entity';
import { VulnerabilityFinding } from './entities/vulnerability-finding.entity';
import { MaliciousCodeFinding } from './entities/malicious-code-finding.entity';
import { DuplicateCodeBlock } from './entities/duplicate-code-block.entity';
import { DependencyReport } from './entities/dependency-report.entity';
import { AnalysisRule } from './entities/analysis-rule.entity';
import { ScanOrchestratorService } from './services/scan-orchestrator.service';
import { CodeAnalysisService } from './services/code-analysis.service';
import { RuleEngineService } from './services/rule-engine.service';
import { DependencyAnalyzerService } from './services/dependency-analyzer.service';
import { ScanController } from './controllers/scan.controller';
import { FindingController } from './controllers/finding.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScanJob,
      DeadCodeFinding,
      VulnerabilityFinding,
      MaliciousCodeFinding,
      DuplicateCodeBlock,
      DependencyReport,
      AnalysisRule,
    ]),
  ],
  controllers: [ScanController, FindingController],
  providers: [
    ScanOrchestratorService,
    CodeAnalysisService,
    RuleEngineService,
    DependencyAnalyzerService,
  ],
  exports: [ScanOrchestratorService, CodeAnalysisService, RuleEngineService],
})
export class CodeAnalysisEngineModule {}
