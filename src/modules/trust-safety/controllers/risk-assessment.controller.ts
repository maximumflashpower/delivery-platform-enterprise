import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RiskAssessmentService } from '../services/risk-assessment.service';
import { RiskAssessment } from '../entities/risk-assessment.entity';

@ApiTags('risk-assessments')
@Controller('trust-safety/risk-assessments')
export class RiskAssessmentController {
  constructor(private readonly service: RiskAssessmentService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new risk assessment' })
  @ApiResponse({ status: 201, type: RiskAssessment })
  create(@Body() data: Partial<RiskAssessment>): Promise<RiskAssessment> {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'List all risk assessments' })
  @ApiResponse({ status: 200, type: [RiskAssessment] })
  findAll(): Promise<RiskAssessment[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a risk assessment' })
  @ApiResponse({ status: 200, type: RiskAssessment })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<RiskAssessment> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a risk assessment' })
  @ApiResponse({ status: 200, type: RiskAssessment })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updates: Partial<RiskAssessment>): Promise<RiskAssessment> {
    return this.service.update(id, updates);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a risk assessment' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.service.remove(id);
  }

  @Post(':id/assess')
  @ApiOperation({ summary: 'Assess a risk with level' })
  @ApiResponse({ status: 200, type: RiskAssessment })
  assess(@Param('id', ParseUUIDPipe) id: string, @Body() body: { assessedBy: string; level: string }): Promise<RiskAssessment> {
    return this.service.assess(id, body.assessedBy, body.level);
  }

  @Post(':id/mitigate')
  @ApiOperation({ summary: 'Mitigate a risk with plan' })
  @ApiResponse({ status: 200, type: RiskAssessment })
  mitigate(@Param('id', ParseUUIDPipe) id: string, @Body('plan') plan: string): Promise<RiskAssessment> {
    return this.service.mitigate(id, plan);
  }

  @Post(':id/escalate')
  @ApiOperation({ summary: 'Escalate a risk' })
  @ApiResponse({ status: 200, type: RiskAssessment })
  escalate(@Param('id', ParseUUIDPipe) id: string): Promise<RiskAssessment> {
    return this.service.escalate(id);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept a risk' })
  @ApiResponse({ status: 200, type: RiskAssessment })
  accept(@Param('id', ParseUUIDPipe) id: string, @Body('acceptedBy') acceptedBy: string): Promise<RiskAssessment> {
    return this.service.accept(id, acceptedBy);
  }
}
