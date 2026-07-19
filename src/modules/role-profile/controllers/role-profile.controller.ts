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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleProfileService } from '../services/role-profile.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../enums/role-level.enum';
import { ProfileType } from '../enums/profile-type.enum';

@ApiTags('role-profile')
@Controller('admin/role-profile')
export class RoleProfileController {
  constructor(private readonly service: RoleProfileService) {}

  @Post('roles')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  createRole(@Body() dto: { name: string; description: string; level: RoleLevel; permissions?: string[] }) {
    return this.service.createRole(dto);
  }

  @Get('roles')
  @ApiOperation({ summary: 'List all active roles' })
  @ApiResponse({ status: 200, description: 'Return list of roles' })
  findAllRoles() {
    return this.service.findAllRoles();
  }

  @Get('roles/:id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({ status: 200, description: 'Return role details' })
  findRoleById(@Param('id') id: string) {
    return this.service.findRoleById(id);
  }

  @Put('roles/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update role' })
  updateRole(@Param('id') id: string, @Body() data: Partial<any>) {
    return this.service.updateRole(id, data);
  }

  @Delete('roles/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Soft delete role' })
  deleteRole(@Param('id') id: string) {
    return this.service.deleteRole(id);
  }

  @Post('profiles')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create user profile' })
  createProfile(@Req() req: any, @Body() dto: { type: ProfileType; bio?: string; website?: string; location?: string }) {
    return this.service.createProfile(req.user.sub, dto);
  }

  @Get('profiles/:userId')
  @ApiOperation({ summary: 'Get profile by user ID' })
  findByUserId(@Param('userId') userId: string) {
    return this.service.findByUserId(userId);
  }

  @Put('profiles/:profileId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update profile' })
  updateProfile(@Param('profileId') profileId: string, @Body() data: Partial<any>) {
    return this.service.updateProfile(profileId, data);
  }

  @Post('users/:userId/roles')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Assign role to user' })
  assignRole(@Req() req: any, @Param('userId') userId: string, @Body() dto: { roleId: string }) {
    return this.service.assignRole(userId, dto.roleId, req.user.sub);
  }

  @Get('users/:userId/roles')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user roles' })
  getUserRoles(@Param('userId') userId: string) {
    return this.service.getUserRoles(userId);
  }

  @Delete('user-roles/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Remove role assignment from user' })
  removeUserRole(@Param('id') id: string) {
    return this.service.removeUserRole(id);
  }

  @Get('check/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check if user has specific roles' })
  async hasRole(@Param('userId') userId: string, @Query('roleIds') roleIds: string) {
    return this.service.hasRole(userId, roleIds.split(','));
  }
}
