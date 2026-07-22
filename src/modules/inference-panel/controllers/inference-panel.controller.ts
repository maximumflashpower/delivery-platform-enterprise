import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InferencePanelService } from '../services/inference-panel.service';
import {
  CreateInferenceLogDto,
  CreatePrivacyBudgetDto,
  UpdatePrivacyBudgetDto,
  CreateBudgetTransactionDto,
  InferenceQueryDto,
} from '../dto/inference-panel.dto';

@ApiTags('Inference Panel')
@ApiBearerAuth()
@Controller('inference-panel')
export class InferencePanelController {
  constructor(private readonly service: InferencePanelService) {}

  // ════════════════════════════════════════════
  // INFERENCE LOGS
  // ════════════════════════════════════════════

  @Post('logs')
  @ApiOperation({ summary: 'Register an AI inference' })
  @ApiResponse({ status: 201, description: 'Inference log created' })
  async createLog(@Body() dto: CreateInferenceLogDto) {
    return this.service.createInferenceLog(dto);
  }

  @Get('logs')
  @ApiOperation({ summary: 'List all inference logs' })
  @ApiResponse({ status: 200, description: 'List of inference logs' })
  async listLogs(@Query() query: InferenceQueryDto) {
    return this.service.findAllInferenceLogs(query);
  }

  @Get('logs/:id')
  @ApiOperation({ summary: 'Get a specific inference log' })
  @ApiResponse({ status: 200, description: 'Inference log details' })
  async getLog(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findInferenceLogById(id);
  }

  @Get('logs/user/:userId')
  @ApiOperation({ summary: 'Get inference logs for a user' })
  @ApiResponse({ status: 200, description: 'User inference logs' })
  async getUserLogs(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.findInferenceLogsByUser(userId);
  }

  // ════════════════════════════════════════════
  // PRIVACY BUDGETS
  // ════════════════════════════════════════════

  @Post('budgets')
  @ApiOperation({ summary: 'Create a privacy budget for a user' })
  @ApiResponse({ status: 201, description: 'Privacy budget created' })
  async createBudget(@Body() dto: CreatePrivacyBudgetDto) {
    return this.service.createBudget(dto);
  }

  @Get('budgets')
  @ApiOperation({ summary: 'List all privacy budgets' })
  @ApiResponse({ status: 200, description: 'List of privacy budgets' })
  async listBudgets() {
    return this.service.findAllBudgets();
  }

  @Get('budgets/:id')
  @ApiOperation({ summary: 'Get a specific privacy budget' })
  @ApiResponse({ status: 200, description: 'Budget details' })
  async getBudget(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findBudgetById(id);
  }

  @Get('budgets/user/:userId')
  @ApiOperation({ summary: 'Get active budget for a user' })
  @ApiResponse({ status: 200, description: 'Active user budget' })
  async getUserBudget(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.findBudgetByUser(userId);
  }

  @Patch('budgets/:id')
  @ApiOperation({ summary: 'Update a privacy budget' })
  @ApiResponse({ status: 200, description: 'Budget updated' })
  async updateBudget(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePrivacyBudgetDto,
  ) {
    return this.service.updateBudget(id, dto);
  }

  @Post('budgets/:id/reset')
  @ApiOperation({ summary: 'Reset budget period (rollover)' })
  @ApiResponse({ status: 200, description: 'Budget period reset' })
  async resetBudget(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.resetBudgetPeriod(id);
  }

  // ════════════════════════════════════════════
  // BUDGET TRANSACTIONS
  // ════════════════════════════════════════════

  @Post('budgets/:id/transactions')
  @ApiOperation({ summary: 'Create a budget transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created' })
  async createTransaction(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateBudgetTransactionDto,
  ) {
    return this.service.createTransaction(id, dto);
  }

  @Get('budgets/:id/transactions')
  @ApiOperation({ summary: 'List transactions for a budget' })
  @ApiResponse({ status: 200, description: 'List of transactions' })
  async listTransactions(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findTransactionsByBudget(id);
  }

  @Get('transactions/:id')
  @ApiOperation({ summary: 'Get a specific transaction' })
  @ApiResponse({ status: 200, description: 'Transaction details' })
  async getTransaction(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findTransactionById(id);
  }

  // ════════════════════════════════════════════
  // STATS
  // ════════════════════════════════════════════

  @Get('stats')
  @ApiOperation({ summary: 'Get inference panel statistics' })
  @ApiResponse({ status: 200, description: 'Panel stats' })
  async getStats() {
    return this.service.getStats();
  }
}
