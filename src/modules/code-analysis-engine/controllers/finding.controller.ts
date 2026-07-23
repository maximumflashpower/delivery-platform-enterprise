import {
  Controller, Get, Patch, Param, Query, Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeadCodeFinding } from '../entities/dead-code-finding.entity';
import { VulnerabilityFinding } from '../entities/vulnerability-finding.entity';
import { MaliciousCodeFinding } from '../entities/malicious-code-finding.entity';
import { DuplicateCodeBlock } from '../entities/duplicate-code-block.entity';
import { UpdateFindingStatusDto } from '../dto/code-analysis.dto';

@ApiTags('Code Analysis - Findings')
@Controller('code-analysis/findings')
export class FindingController {
  constructor(
    @InjectRepository(DeadCodeFinding) private readonly deadCodeRepo: Repository<DeadCodeFinding>,
    @InjectRepository(VulnerabilityFinding) private readonly vulnRepo: Repository<VulnerabilityFinding>,
    @InjectRepository(MaliciousCodeFinding) private readonly maliciousRepo: Repository<MaliciousCodeFinding>,
    @InjectRepository(DuplicateCodeBlock) private readonly dupRepo: Repository<DuplicateCodeBlock>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all findings with optional filters' })
  @ApiQuery({ name: 'scanId', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'status', required: false })
  async listFindings(
    @Query('scanId') scanId?: string,
    @Query('severity') severity?: string,
    @Query('status') status?: string,
  ) {
    const where: any = {};
    if (scanId) where.scanId = scanId;
    if (severity) where.severity = severity;
    if (status) where.status = status;

    const [deadCode, vulns, malicious, dupes] = await Promise.all([
      this.deadCodeRepo.find({ where, take: 100, order: { lineNumber: 'ASC' } }),
      this.vulnRepo.find({ where, take: 100, order: { lineNumber: 'ASC' } }),
      this.maliciousRepo.find({ where, take: 100, order: { lineNumber: 'ASC' } }),
      this.dupRepo.find({ where, take: 50, order: { similarityScore: 'DESC' } }),
    ]);

    return {
      deadCode,
      vulnerabilities: vulns,
      maliciousCode: malicious,
      duplicates: dupes,
      totals: {
        deadCode: deadCode.length,
        vulnerabilities: vulns.length,
        maliciousCode: malicious.length,
        duplicates: dupes.length,
      },
    };
  }

  @Get('dead-code')
  @ApiOperation({ summary: 'List dead code findings' })
  @ApiQuery({ name: 'scanId', required: false })
  async listDeadCode(@Query('scanId') scanId?: string) {
    const where: any = {};
    if (scanId) where.scanId = scanId;
    return this.deadCodeRepo.find({ where, take: 200, order: { filePath: 'ASC', lineNumber: 'ASC' } });
  }

  @Get('vulnerabilities')
  @ApiOperation({ summary: 'List vulnerability findings' })
  @ApiQuery({ name: 'scanId', required: false })
  async listVulns(@Query('scanId') scanId?: string) {
    const where: any = {};
    if (scanId) where.scanId = scanId;
    return this.vulnRepo.find({ where, take: 200, order: { severity: 'DESC', filePath: 'ASC' } });
  }

  @Get('malicious')
  @ApiOperation({ summary: 'List malicious code findings' })
  @ApiQuery({ name: 'scanId', required: false })
  async listMalicious(@Query('scanId') scanId?: string) {
    const where: any = {};
    if (scanId) where.scanId = scanId;
    return this.maliciousRepo.find({ where, take: 200, order: { severity: 'DESC', filePath: 'ASC' } });
  }

  @Get('duplicates')
  @ApiOperation({ summary: 'List duplicate code blocks' })
  @ApiQuery({ name: 'scanId', required: false })
  async listDuplicates(@Query('scanId') scanId?: string) {
    const where: any = {};
    if (scanId) where.scanId = scanId;
    return this.dupRepo.find({ where, take: 100, order: { similarityScore: 'DESC' } });
  }

  @Patch('dead-code/:id/status')
  @ApiOperation({ summary: 'Update dead code finding status' })
  async updateDeadCodeStatus(@Param('id') id: string, @Body() dto: UpdateFindingStatusDto) {
    const finding = await this.deadCodeRepo.findOne({ where: { id } });
    if (!finding) throw new Error(`Finding ${id} not found`);
    finding.status = dto.status;
    return this.deadCodeRepo.save(finding);
  }

  @Patch('vulnerabilities/:id/status')
  @ApiOperation({ summary: 'Update vulnerability finding status' })
  async updateVulnStatus(@Param('id') id: string, @Body() dto: UpdateFindingStatusDto) {
    const finding = await this.vulnRepo.findOne({ where: { id } });
    if (!finding) throw new Error(`Finding ${id} not found`);
    finding.status = dto.status;
    return this.vulnRepo.save(finding);
  }

  @Patch('malicious/:id/status')
  @ApiOperation({ summary: 'Update malicious code finding status' })
  async updateMaliciousStatus(@Param('id') id: string, @Body() dto: UpdateFindingStatusDto) {
    const finding = await this.maliciousRepo.findOne({ where: { id } });
    if (!finding) throw new Error(`Finding ${id} not found`);
    finding.status = dto.status;
    return this.maliciousRepo.save(finding);
  }

  @Patch('duplicates/:id/status')
  @ApiOperation({ summary: 'Update duplicate finding status' })
  async updateDupStatus(@Param('id') id: string, @Body() dto: UpdateFindingStatusDto) {
    const finding = await this.dupRepo.findOne({ where: { id } });
    if (!finding) throw new Error(`Finding ${id} not found`);
    finding.status = dto.status;
    return this.dupRepo.save(finding);
  }
}
