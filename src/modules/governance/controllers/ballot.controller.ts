import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BallotService } from '../services/ballot.service';
import { Ballot } from '../entities/ballot.entity';

@ApiTags('Governance - Ballots')
@Controller('governance/ballots')
export class BallotController {
  constructor(private readonly service: BallotService) {}

  @Post()
  @ApiOperation({ summary: 'Create a ballot' })
  @ApiResponse({ status: 201, type: Ballot })
  async create(@Body() body: {
    assemblyId: string;
    title: string;
    description?: string;
    options: string[];
    openingAt?: string;
    closingAt?: string;
  }): Promise<Ballot> {
    return this.service.create({
      assemblyId: body.assemblyId,
      title: body.title,
      description: body.description,
      options: body.options,
      openingAt: body.openingAt ? new Date(body.openingAt) : undefined,
      closingAt: body.closingAt ? new Date(body.closingAt) : undefined,
    });
  }

  @Get()
  @ApiOperation({ summary: 'List ballots by assembly' })
  @ApiParam({ name: 'assemblyId', required: false })
  async findByAssembly(@Query('assemblyId') assemblyId: string): Promise<Ballot[]> {
    return this.service.findByAssembly(assemblyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ballot details' })
  async findById(@Param('id') id: string): Promise<Ballot> {
    return this.service.findById(id);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close ballot and record results' })
  async close(
    @Param('id') id: string,
    @Body() body: { results: Record<string, number> },
  ): Promise<Ballot> {
    return this.service.close(id, body.results);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a ballot' })
  async cancel(
    @Param('id') id: string,
    @Body() body: { reason: string },
  ): Promise<Ballot> {
    return this.service.cancel(id, body.reason);
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Get ballot results' })
  async getResults(@Param('id') id: string) {
    return this.service.getResults(id);
  }
}
