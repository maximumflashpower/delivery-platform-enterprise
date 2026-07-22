import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { RedTeamService } from '../services/red-team.service';
import {
  CreateRedTeamTestDto,
  UpdateTestResultDto,
  CreateFindingDto,
  ResolveFindingDto,
  ListTestsQueryDto,
} from '../dto/red-team.dto';

@ApiTags('Red-Team')
@Controller('red-team')
export class RedTeamController {
  constructor(private readonly service: RedTeamService) {}

  // === TESTS ===

  @Get('tests')
  @ApiOperation({ summary: 'List all red-team tests' })
  async findAllTests(@Query() query: ListTestsQueryDto) {
    return this.service.findAllTests(query);
  }

  @Get('tests/stats')
  @ApiOperation({ summary: 'Get red-team statistics' })
  async getStats() {
    return this.service.getStats();
  }

  @Get('tests/:id')
  @ApiOperation({ summary: 'Get test by ID' })
  async findTestById(@Param('id') id: string) {
    return this.service.findTestById(id);
  }

  @Post('tests')
  @ApiOperation({ summary: 'Create a new red-team test' })
  async createTest(@Body() dto: CreateRedTeamTestDto, @Req() req: any) {
    const executedBy = req?.user?.id ?? 'system';
    return this.service.createTest(executedBy, dto);
  }

  @Post('tests/:id/execute')
  @ApiOperation({ summary: 'Start executing a red-team test' })
  async executeTest(@Param('id') id: string) {
    return this.service.executeTest(id);
  }

  @Put('tests/:id/result')
  @ApiOperation({ summary: 'Update test result after execution' })
  async updateTestResult(@Param('id') id: string, @Body() dto: UpdateTestResultDto) {
    return this.service.updateTestResult(id, dto);
  }

  @Delete('tests/:id')
  @ApiOperation({ summary: 'Delete a red-team test' })
  async deleteTest(@Param('id') id: string) {
    await this.service.deleteTest(id);
    return { deleted: true };
  }

  // === FINDINGS ===

  @Get('findings')
  @ApiOperation({ summary: 'List all findings (optionally filtered by modelId)' })
  async findAllFindings(@Query('modelId') modelId?: string) {
    return this.service.findAllFindings(modelId);
  }

  @Get('findings/test/:testId')
  @ApiOperation({ summary: 'List findings for a specific test' })
  async findFindingsByTest(@Param('testId') testId: string) {
    return this.service.findFindingsByTest(testId);
  }

  @Post('findings')
  @ApiOperation({ summary: 'Create a finding for a test' })
  async createFinding(@Body() dto: CreateFindingDto) {
    return this.service.createFinding(dto);
  }

  @Put('findings/:id/resolve')
  @ApiOperation({ summary: 'Resolve a finding' })
  async resolveFinding(@Param('id') id: string, @Body() dto: ResolveFindingDto) {
    return this.service.resolveFinding(id, dto);
  }
}
