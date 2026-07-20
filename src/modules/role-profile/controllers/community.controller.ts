import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommunityService } from '../services/community.service';
import { Community, CommunityType, MembershipApproval } from '../entities/community.entity';

@ApiTags('communities')
@Controller('api/role-profile/communities')
export class CommunityController {
  constructor(private readonly service: CommunityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new community' })
  @ApiResponse({ status: 201, type: Community })
  create(@Body() data: Partial<Community>): Promise<Community> {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'List all active communities' })
  @ApiResponse({ status: 200, type: [Community] })
  findAll(@Query('type') type?: CommunityType): Promise<Community[]> {
    return this.service.findAll(type);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Find community by slug' })
  @ApiResponse({ status: 200, type: Community })
  findBySlug(@Param('slug') slug: string): Promise<Community> {
    return this.service.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a community' })
  @ApiResponse({ status: 200, type: Community })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Community> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a community' })
  @ApiResponse({ status: 200, type: Community })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updates: Partial<Community>): Promise<Community> {
    return this.service.update(id, updates);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive a community' })
  @ApiResponse({ status: 200, type: Community })
  archive(@Param('id', ParseUUIDPipe) id: string): Promise<Community> {
    return this.service.archive(id);
  }
}
