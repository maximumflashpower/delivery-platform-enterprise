import { Controller, Get, Post, Body, Patch, Delete, Query, Param} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProposalService } from '../services/proposal.service';
import { CreateProposalDto } from '../dto/create-proposal.dto'
import { UpdateProposalDto } from '../dto/update-proposal.dto';
import { Proposal } from '../entities/proposal.entity';

@ApiTags('Governance - Proposals')
@Controller('api/governance/proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new proposal' })
  @ApiResponse({ status: 201, description: 'Proposal created', type: Proposal })
  async create(@Body() dto: CreateProposalDto): Promise<Proposal> {
    return this.proposalService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all proposals' })
  @ApiQuery({ name: 'assemblyId', required: false })
  @ApiResponse({ status: 200, description: 'List of proposals', type: [Proposal] })
  async findAll(@Query('assemblyId') assemblyId?: string): Promise<Proposal[]> {
    return this.proposalService.findAll(assemblyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get proposal details' })
  @ApiParam({ name: 'id', description: 'Proposal UUID' })
  @ApiResponse({ status: 200, description: 'Proposal details', type: Proposal })
  async findOne(@Param('id') id: string): Promise<Proposal> {
    return this.proposalService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update proposal' })
  @ApiParam({ name: 'id', description: 'Proposal UUID' })
  @ApiResponse({ status: 200, description: 'Proposal updated', type: Proposal })
  async update(@Param('id') id: string, @Body() dto: UpdateProposalDto): Promise<Proposal> {
    return this.proposalService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete proposal' })
  @ApiParam({ name: 'id', description: 'Proposal UUID' })
  @ApiResponse({ status: 200, description: 'Proposal deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.proposalService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit proposal for voting' })
  @ApiParam({ name: 'id', description: 'Proposal UUID' })
  @ApiResponse({ status: 200, description: 'Proposal submitted', type: Proposal })
  async submitForVoting(@Param('id') id: string): Promise<Proposal> {
    return this.proposalService.submitForVoting(id);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close voting and record results' })
  @ApiParam({ name: 'id', description: 'Proposal UUID' })
  @ApiResponse({ status: 200, description: 'Voting closed', type: Proposal })
  async closeVoting(
    @Param('id') id: string,
    @Body() results: { approved: number; rejected: number; abstained: number },
  ): Promise<Proposal> {
    return this.proposalService.closeVoting(id, results);
  }
}
