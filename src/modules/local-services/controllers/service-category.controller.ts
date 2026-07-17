import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { ServiceCategoryService } from '../services/service-category.service';
import { ServiceCategory } from '../entities/service-category.entity';

@Controller('service-categories')
@ApiTags('Local Services - Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class ServiceCategoryController {
  constructor(private readonly categoryService: ServiceCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'List all active categories' })
  @ApiResponse({ status: 200, type: [ServiceCategory] })
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: ServiceCategory })
  async findById(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiParam({ name: 'slug' })
  @ApiResponse({ status: 200, type: ServiceCategory })
  async findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Create service category' })
  @ApiBody({ type: ServiceCategory })
  @ApiResponse({ status: 201, type: ServiceCategory })
  async create(@Body() data: Partial<ServiceCategory>) {
    return this.categoryService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: ServiceCategory })
  async update(@Param('id') id: string, @Body() data: Partial<ServiceCategory>) {
    return this.categoryService.update(id, data);
  }

  @Post(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle category active status' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async toggleActive(@Param('id') id: string) {
    return this.categoryService.toggleActive(id);
  }
}
