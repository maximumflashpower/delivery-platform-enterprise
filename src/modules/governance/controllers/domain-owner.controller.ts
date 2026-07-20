import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DomainOwnerService } from '../services/domain-owner.service';
import { DomainOwner } from '../entities/domain-owner.entity';

@ApiTags('domain-owners')
@Controller('api/governance/domain-owners')
export class DomainOwnerController {
  constructor(private readonly domainOwnerService: DomainOwnerService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new domain owner' })
  @ApiResponse({ status: 201, description: 'Owner registered successfully', type: DomainOwner })
  create(@Body() ownerData: Partial<DomainOwner>): Promise<DomainOwner> {
    return this.domainOwnerService.create(ownerData);
  }

  @Get()
  @ApiOperation({ summary: 'List all active domain owners' })
  @ApiResponse({ status: 200, description: 'Return all owners', type: [DomainOwner] })
  findAll(): Promise<DomainOwner[]> {
    return this.domainOwnerService.findAll();
  }

  @Get('domain/:domain')
  @ApiOperation({ summary: 'Find owner by domain' })
  @ApiResponse({ status: 200, description: 'Return the owner', type: DomainOwner })
  findByDomain(@Param('domain') domain: string): Promise<DomainOwner> {
    return this.domainOwnerService.findByDomain(domain);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific domain owner' })
  @ApiResponse({ status: 200, description: 'Return the owner', type: DomainOwner })
  @ApiResponse({ status: 404, description: 'Owner not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<DomainOwner> {
    return this.domainOwnerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a domain owner' })
  @ApiResponse({ status: 200, description: 'Owner updated', type: DomainOwner })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updates: Partial<DomainOwner>): Promise<DomainOwner> {
    return this.domainOwnerService.update(id, updates);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate a domain owner' })
  @ApiResponse({ status: 204, description: 'Owner deactivated' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DomainOwner> {
    return this.domainOwnerService.deactivate(id);
  }
}
