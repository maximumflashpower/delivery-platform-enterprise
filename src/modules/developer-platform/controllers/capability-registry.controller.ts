import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CapabilityRegistryService } from '../services/capability-registry.service';
import { CreateCapabilityDto } from '../dto/create-capability.dto';
import { CreateSourceAuthorityDto } from '../dto/create-source-authority.dto';

@ApiTags('developer-platform')
@Controller('developer-platform')
export class CapabilityRegistryController {
  constructor(private readonly service: CapabilityRegistryService) {}

  // === Registry Health ===

  @Get('registry/health')
  @ApiOperation({ summary: 'Get capability registry health summary' })
  @ApiResponse({ status: 200, description: 'Registry health metrics' })
  async getRegistryHealth() {
    return this.service.getRegistryHealth();
  }

  // === Capabilities ===

  @Get('capabilities')
  @ApiOperation({ summary: 'List all registered capabilities' })
  async findAllCapabilities(
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.service.findAllCapabilities(
      category,
      isActive === undefined ? undefined : isActive === 'true',
    );
  }

  @Get('capabilities/:id')
  @ApiOperation({ summary: 'Get capability by ID' })
  async findCapabilityById(@Param('id') id: string) {
    return this.service.findCapabilityById(id);
  }

  @Get('capabilities/key/:key')
  @ApiOperation({ summary: 'Get capability by key' })
  async findCapabilityByKey(@Param('key') key: string) {
    return this.service.findCapabilityByKey(key);
  }

  @Post('capabilities')
  @ApiOperation({ summary: 'Register a new capability' })
  async createCapability(@Body() dto: CreateCapabilityDto) {
    return this.service.createCapability(dto);
  }

  @Put('capabilities/:id')
  @ApiOperation({ summary: 'Update a capability' })
  async updateCapability(@Param('id') id: string, @Body() dto: Partial<CreateCapabilityDto>) {
    return this.service.updateCapability(id, dto);
  }

  @Delete('capabilities/:id')
  @ApiOperation({ summary: 'Remove a capability from registry' })
  async deleteCapability(@Param('id') id: string) {
    await this.service.deleteCapability(id);
    return { deleted: true };
  }

  // === Source Authorities ===

  @Get('authorities')
  @ApiOperation({ summary: 'List all source authorities' })
  async findAllAuthorities(
    @Query('trustLevel') trustLevel?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.service.findAllAuthorities(
      trustLevel,
      isActive === undefined ? undefined : isActive === 'true',
    );
  }

  @Get('authorities/:id')
  @ApiOperation({ summary: 'Get source authority by ID' })
  async findAuthorityById(@Param('id') id: string) {
    return this.service.findAuthorityById(id);
  }

  @Get('authorities/key/:key')
  @ApiOperation({ summary: 'Get source authority by key' })
  async findAuthorityByKey(@Param('key') key: string) {
    return this.service.findAuthorityByKey(key);
  }

  @Post('authorities')
  @ApiOperation({ summary: 'Register a new source authority' })
  async createAuthority(@Body() dto: CreateSourceAuthorityDto) {
    return this.service.createAuthority(dto);
  }

  @Put('authorities/:id')
  @ApiOperation({ summary: 'Update a source authority' })
  async updateAuthority(@Param('id') id: string, @Body() dto: Partial<CreateSourceAuthorityDto>) {
    return this.service.updateAuthority(id, dto);
  }

  @Delete('authorities/:id')
  @ApiOperation({ summary: 'Remove a source authority' })
  async deleteAuthority(@Param('id') id: string) {
    await this.service.deleteAuthority(id);
    return { deleted: true };
  }
}
