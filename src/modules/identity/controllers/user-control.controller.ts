import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UserControlService } from '../services/user-control.service';
import { CreateUserControlDto } from '../dto/create-user-control.dto';
import { UpdateUserControlDto } from '../dto/update-user-control.dto';
import { UserControl } from '../entities/user-control.entity';

@ApiTags('Identity - User Controls')
@Controller('identity/controls')
export class UserControlController {
  constructor(private readonly service: UserControlService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user control setting' })
  @ApiResponse({ status: 201, type: UserControl })
  async create(@Body() dto: CreateUserControlDto): Promise<UserControl> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List user controls' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiResponse({ status: 200, type: [UserControl] })
  async findByUser(@Query('userId') userId: string): Promise<UserControl[]> {
    return this.service.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get control details' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: UserControl })
  async findById(@Param('id') id: string): Promise<UserControl> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update control' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: UserControl })
  async update(@Param('id') id: string, @Body() dto: UpdateUserControlDto): Promise<UserControl> {
    return this.service.update(id, dto);
  }

  @Post(':id/enable')
  @ApiOperation({ summary: 'Enable a control' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: UserControl })
  async enable(@Param('id') id: string): Promise<UserControl> {
    return this.service.enable(id);
  }

  @Post(':id/disable')
  @ApiOperation({ summary: 'Disable a control' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: UserControl })
  async disable(@Param('id') id: string): Promise<UserControl> {
    return this.service.disable(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke/delete a control' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }

  @Get(':id/audit')
  @ApiOperation({ summary: 'Get audit trail for a control' })
  @ApiParam({ name: 'id' })
  async getAuditTrail(@Param('id') id: string) {
    return this.service.getAuditTrail(id);
  }
}
