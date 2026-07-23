import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScanJob } from '../entities/scan-job.entity';
import * as path from 'path';
import { DeadCodeFinding } from '../entities/dead-code-finding.entity';
import { VulnerabilityFinding } from '../entities/vulnerability-finding.entity';
import { MaliciousCodeFinding } from '../entities/malicious-code-finding.entity';
import { DuplicateCodeBlock } from '../entities/duplicate-code-block.entity';
import { CodeAnalysisService, AnalysisResult } from './code-analysis.service';
import { RuleEngineService } from './rule-engine.service';
import { DependencyAnalyzerService } from './dependency-analyzer.service';
import { CreateScanDto } from '../dto/code-analysis.dto';

@Injectable()
export class ScanOrchestratorService {
  private readonly logger = new Logger(ScanOrchestratorService.name);

  constructor(
    @InjectRepository(ScanJob) private readonly scanRepo: Repository<ScanJob>,
    @InjectRepository(DeadCodeFinding) private readonly deadCodeRepo: Repository<DeadCodeFinding>,
    @InjectRepository(VulnerabilityFinding) private readonly vulnRepo: Repository<VulnerabilityFinding>,
    @InjectRepository(MaliciousCodeFinding) private readonly maliciousRepo: Repository<MaliciousCodeFinding>,
    @InjectRepository(DuplicateCodeBlock) private readonly dupRepo: Repository<DuplicateCodeBlock>,
    private readonly codeAnalysisService: CodeAnalysisService,
    private readonly ruleEngineService: RuleEngineService,
    private readonly depAnalyzerService: DependencyAnalyzerService,
  ) {}

  async createScan(dto: CreateScanDto): Promise<ScanJob> {
    const scan = new ScanJob();
    scan.targetType = dto.targetType ?? 'full_project';
    scan.targetPath = dto.targetPath ?? 'src/';
    scan.status = 'pending';
    scan.triggeredBy = dto.triggeredBy ?? 'system';
    scan.totalFindings = 0;
    scan.filesScanned = 0;
    scan.findingsBySeverity = null;
    scan.findingsByType = null;
    scan.scanDurationMs = null;
    scan.errorMessage = null;

    const saved = await this.scanRepo.save(scan);
    this.logger.log(`Scan created: ${saved.id}`);

    // Execute asynchronously
    this.executeScan(saved.id, scan.targetPath).catch(err => {
      this.logger.error(`Scan ${saved.id} failed: ${err.message}`);
    });

    return saved;
  }

  async executeScan(scanId: string, targetPath: string): Promise<void> {
    const startTime = Date.now();
    const scan = await this.scanRepo.findOne({ where: { id: scanId } });
    if (!scan) return;

    try {
      scan.status = 'running';
      await this.scanRepo.save(scan);

      // Ensure built-in rules are seeded
      await this.ruleEngineService.seedBuiltInRules();
      const rules = await this.ruleEngineService.findEnabled();

      // Collect files
      const basePath = process.cwd();
      const fullPath = path.join(basePath, targetPath);
      const files = this.codeAnalysisService.walkDirectory(fullPath);

      this.logger.log(`Scanning ${files.length} files in ${targetPath}`);

      const allDeadCode: any[] = [];
      const allVulns: any[] = [];
      const allMalicious: any[] = [];
      const fileContents: { path: string; content: string }[] = [];

      for (const filePath of files) {
        const content = this.codeAnalysisService.readFileContent(filePath);
        if (!content) continue;

        const relPath = filePath.replace(basePath + '/', '');
        fileContents.push({ path: relPath, content });

        const result = this.codeAnalysisService.analyzeFile(relPath, content, rules, scanId);
        allDeadCode.push(...result.deadCode);
        allVulns.push(...result.vulnerabilities);
        allMalicious.push(...result.maliciousCode);
      }

      // Detect duplicates
      const duplicates = this.codeAnalysisService.findDuplicates(fileContents, scanId, 6);

      // Save findings
      if (allDeadCode.length > 0) await this.deadCodeRepo.save(allDeadCode);
      if (allVulns.length > 0) await this.vulnRepo.save(allVulns);
      if (allMalicious.length > 0) await this.maliciousRepo.save(allMalicious);
      if (duplicates.length > 0) await this.dupRepo.save(duplicates);

      // Analyze dependencies
      await this.depAnalyzerService.analyzeDependencies(basePath, scanId);

      const depCount = await this.depAnalyzerService.findByScan(scanId);

      // Build summary
      const totalFindings = allDeadCode.length + allVulns.length + allMalicious.length + duplicates.length + depCount.length;
      const bySeverity: Record<string, number> = {};
      const byType: Record<string, number> = {
        dead_code: allDeadCode.length,
        vulnerability: allVulns.length,
        malicious: allMalicious.length,
        duplicate: duplicates.length,
        dependency: depCount.length,
      };

      [...allDeadCode, ...allVulns, ...allMalicious].forEach(f => {
        const sev = f.severity || 'info';
        bySeverity[sev] = (bySeverity[sev] || 0) + 1;
      });

      scan.status = 'completed';
      scan.totalFindings = totalFindings;
      scan.filesScanned = files.length;
      scan.findingsBySeverity = JSON.stringify(bySeverity);
      scan.findingsByType = JSON.stringify(byType);
      scan.scanDurationMs = Date.now() - startTime;

      await this.scanRepo.save(scan);
      this.logger.log(`Scan ${scanId} completed: ${totalFindings} findings in ${scan.scanDurationMs}ms`);

    } catch (err) {
      scan.status = 'failed';
      scan.errorMessage = (err as Error).message;
      scan.scanDurationMs = Date.now() - startTime;
      await this.scanRepo.save(scan);
      this.logger.error(`Scan ${scanId} failed: ${(err as Error).message}`);
    }
  }

  async getScan(id: string): Promise<ScanJob> {
    const scan = await this.scanRepo.findOne({ where: { id } });
    if (!scan) throw new NotFoundException(`Scan ${id} not found`);
    return scan;
  }

  async listScans(): Promise<ScanJob[]> {
    return this.scanRepo.find({ order: { createdAt: 'DESC' }, take: 50 });
  }

  async getScanResults(id: string) {
    const scan = await this.getScan(id);
    const [deadCode, vulns, malicious, dupes, deps] = await Promise.all([
      this.deadCodeRepo.find({ where: { scanId: id }, take: 200 }),
      this.vulnRepo.find({ where: { scanId: id }, take: 200 }),
      this.maliciousRepo.find({ where: { scanId: id }, take: 200 }),
      this.dupRepo.find({ where: { scanId: id }, take: 100 }),
      this.depAnalyzerService.findByScan(id),
    ]);

    return {
      scan,
      summary: {
        totalFindings: scan.totalFindings,
        bySeverity: scan.findingsBySeverity ? JSON.parse(scan.findingsBySeverity) : {},
        byType: scan.findingsByType ? JSON.parse(scan.findingsByType) : {},
        filesScanned: scan.filesScanned,
        durationMs: scan.scanDurationMs,
      },
      findings: {
        deadCode,
        vulnerabilities: vulns,
        maliciousCode: malicious,
        duplicates: dupes,
        dependencies: deps,
      },
    };
  }

  async deleteScan(id: string): Promise<void> {
    await this.getScan(id);
    await Promise.all([
      this.deadCodeRepo.delete({ scanId: id }),
      this.vulnRepo.delete({ scanId: id }),
      this.maliciousRepo.delete({ scanId: id }),
      this.dupRepo.delete({ scanId: id }),
    ]);
    await this.scanRepo.delete(id);
  }

  async getStats() {
    const totalScans = await this.scanRepo.count();
    const completedScans = await this.scanRepo.count({ where: { status: 'completed' } });
    const totalDeadCode = await this.deadCodeRepo.count();
    const totalVulns = await this.vulnRepo.count();
    const totalMalicious = await this.maliciousRepo.count();
    const totalDupes = await this.dupRepo.count();

    const openVulns = await this.vulnRepo.count({ where: { status: 'open' } });
    const openMalicious = await this.maliciousRepo.count({ where: { status: 'open' } });

    return {
      totalScans,
      completedScans,
      totalFindings: totalDeadCode + totalVulns + totalMalicious + totalDupes,
      totalDeadCode,
      totalVulnerabilities: totalVulns,
      totalMalicious: totalMalicious,
      totalDuplicates: totalDupes,
      openVulnerabilities: openVulns,
      openMalicious: openMalicious,
    };
  }

  async getStatsBySeverity() {
    const results: { severity: string; count: number }[] = [];
    for (const sev of ['info', 'low', 'medium', 'warning', 'high', 'critical']) {
      const dc = await this.deadCodeRepo.count({ where: { severity: sev } });
      const vu = await this.vulnRepo.count({ where: { severity: sev } });
      const ma = await this.maliciousRepo.count({ where: { severity: sev } });
      const total = dc + vu + ma;
      if (total > 0) results.push({ severity: sev, count: total });
    }
    return results;
  }

  async getStatsByType() {
    return [
      { type: 'dead_code', count: await this.deadCodeRepo.count() },
      { type: 'vulnerability', count: await this.vulnRepo.count() },
      { type: 'malicious', count: await this.maliciousRepo.count() },
      { type: 'duplicate', count: await this.dupRepo.count() },
    ];
  }
}
