import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { DependencyReport } from '../entities/dependency-report.entity';

@Injectable()
export class DependencyAnalyzerService {
  private readonly logger = new Logger(DependencyAnalyzerService.name);

  // Known risky or commonly outdated packages with severity guidance
  private readonly KNOWN_RISKY_PACKAGES: Record<string, { reason: string; severity: string }> = {
    'lodash': { reason: 'CVE-2021-23337 (command injection)', severity: 'high' },
    'axios': { reason: 'Check for CVE-2023-45857 (SSRF)', severity: 'medium' },
    'node-forge': { reason: 'CVE-2022-24772 (prototype pollution)', severity: 'high' },
    'minimist': { reason: 'CVE-2021-44906 (prototype pollution)', severity: 'high' },
    'handlebars': { reason: 'CVE-2021-23383 (XSS)', severity: 'medium' },
    'moment': { reason: 'Deprecated - use date-fns or luxon', severity: 'info' },
    'request': { reason: 'Deprecated - use node-fetch or axios', severity: 'info' },
    'bcryptjs': { reason: 'Pure JS impl slower than bcrypt native', severity: 'low' },
  };

  constructor(
    @InjectRepository(DependencyReport)
    private readonly depRepo: Repository<DependencyReport>,
  ) {}

  async analyzeDependencies(projectPath: string, scanId: string): Promise<DependencyReport[]> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      this.logger.warn('package.json not found');
      return [];
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const deps = packageJson.dependencies || {};
    const devDeps = packageJson.devDependencies || {};
    const reports: DependencyReport[] = [];

    for (const [name, version] of Object.entries(deps)) {
      const report = this.createReport(name, version as string, 'dependencies', scanId);
      reports.push(report);
    }

    for (const [name, version] of Object.entries(devDeps)) {
      const report = this.createReport(name, version as string, 'devDependencies', scanId);
      reports.push(report);
    }

    const saved = await this.depRepo.save(reports);
    this.logger.log(`Analyzed ${saved.length} dependencies`);
    return saved;
  }

  private createReport(name: string, version: string, type: string, scanId: string): DependencyReport {
    const cleanVersion = version.replace(/[\^~>=<]/g, '');
    const risky = this.KNOWN_RISKY_PACKAGES[name];
    const report = new DependencyReport();
    report.scanId = scanId;
    report.packageName = name;
    report.currentVersion = cleanVersion;
    report.latestVersion = null;
    report.isOutdated = !!risky;
    report.severity = risky?.severity ?? 'info';
    report.knownCVEs = risky?.reason ?? null;
    report.licenseType = null;
    report.dependencyType = type;
    report.status = 'open';
    return report;
  }

  async findByScan(scanId: string): Promise<DependencyReport[]> {
    return this.depRepo.find({ where: { scanId }, order: { severity: 'DESC', packageName: 'ASC' } });
  }

  async findOutdated(scanId: string): Promise<DependencyReport[]> {
    return this.depRepo.find({ where: { scanId, isOutdated: true }, order: { severity: 'DESC' } });
  }
}
