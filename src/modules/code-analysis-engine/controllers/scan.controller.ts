import {
  Controller, Get, Post, Delete, Body, Param, Query, Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ScanOrchestratorService } from '../services/scan-orchestrator.service';
import { RuleEngineService } from '../services/rule-engine.service';
import { DependencyAnalyzerService } from '../services/dependency-analyzer.service';
import { CreateScanDto, CreateRuleDto, UpdateRuleDto } from '../dto/code-analysis.dto';

@ApiTags('Code Analysis')
@Controller('code-analysis')
export class ScanController {
  constructor(
    private readonly scanService: ScanOrchestratorService,
    private readonly ruleService: RuleEngineService,
    private readonly depService: DependencyAnalyzerService,
  ) {}

  // ── Scans ──
  @Post('scans')
  @ApiOperation({ summary: 'Create and launch a new code analysis scan' })
  async createScan(@Body() dto: CreateScanDto) {
    return this.scanService.createScan(dto);
  }

  @Get('scans')
  @ApiOperation({ summary: 'List all scans' })
  async listScans() {
    return this.scanService.listScans();
  }

  @Get('scans/:id')
  @ApiOperation({ summary: 'Get scan details by ID' })
  async getScan(@Param('id') id: string) {
    return this.scanService.getScan(id);
  }

  @Get('scans/:id/results')
  @ApiOperation({ summary: 'Get consolidated scan results' })
  async getScanResults(@Param('id') id: string) {
    return this.scanService.getScanResults(id);
  }

  @Delete('scans/:id')
  @ApiOperation({ summary: 'Delete a scan and all its findings' })
  async deleteScan(@Param('id') id: string) {
    await this.scanService.deleteScan(id);
    return { message: `Scan ${id} deleted` };
  }

  // ── Rules ──
  @Get('rules')
  @ApiOperation({ summary: 'List all analysis rules' })
  async listRules() {
    return this.ruleService.findAll();
  }

  @Post('rules')
  @ApiOperation({ summary: 'Create a custom analysis rule' })
  async createRule(@Body() dto: CreateRuleDto) {
    return this.ruleService.create(dto);
  }

  @Patch('rules/:id')
  @ApiOperation({ summary: 'Update an analysis rule' })
  async updateRule(@Param('id') id: string, @Body() dto: UpdateRuleDto) {
    return this.ruleService.update(id, dto);
  }

  @Delete('rules/:id')
  @ApiOperation({ summary: 'Delete a custom rule (built-in rules cannot be deleted)' })
  async deleteRule(@Param('id') id: string) {
    await this.ruleService.delete(id);
    return { message: `Rule ${id} deleted` };
  }

  // ── Dependencies ──
  @Get('dependencies')
  @ApiOperation({ summary: 'List dependency reports' })
  @ApiQuery({ name: 'scanId', required: false })
  async listDependencies(@Query('scanId') scanId?: string) {
    if (scanId) return this.depService.findByScan(scanId);
    return [];
  }

  @Get('dependencies/outdated')
  @ApiOperation({ summary: 'List outdated/risky dependencies' })
  @ApiQuery({ name: 'scanId', required: true })
  async listOutdated(@Query('scanId') scanId: string) {
    return this.depService.findOutdated(scanId);
  }

  // ── Stats ──
  @Get('stats')
  @ApiOperation({ summary: 'Global code analysis statistics' })
  async getStats() {
    return this.scanService.getStats();
  }

  @Get('stats/by-severity')
  @ApiOperation({ summary: 'Statistics grouped by severity' })
  async getStatsBySeverity() {
    return this.scanService.getStatsBySeverity();
  }

  @Get('stats/by-type')
  @ApiOperation({ summary: 'Statistics grouped by finding type' })
  async getStatsByType() {
    return this.scanService.getStatsByType();
  }
}
