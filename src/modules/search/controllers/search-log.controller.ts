import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { SearchLogService } from '../services/search-log.service';
import { SearchLog } from '../entities/search-log.entity';

@Controller('search-logs')
@ApiTags('Search - Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class SearchLogController {
  constructor(private readonly logService: SearchLogService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'List search logs (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200 })
  async findAll(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.logService.findAll(page ? Number(page) : 1, pageSize ? Number(pageSize) : 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get search log by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: SearchLog })
  async findById(@Param('id') id: string) { return this.logService.findById(id); }

  @Get('user/:userId')
  @ApiOperation({ summary: 'List search logs by user ID' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [SearchLog] })
  async findByUserId(@Param('userId') userId: string) { return this.logService.findByUserId(userId); }

  @Post()
  @ApiOperation({ summary: 'Create search log entry' })
  @ApiBody({ type: SearchLog })
  @ApiResponse({ status: 201, type: SearchLog })
  async create(@Body() data: Partial<SearchLog>) { return this.logService.create(data); }

  @Post('analytics')
  @ApiOperation({ summary: 'Get search analytics' })
  @ApiBody({ schema: { type: 'object', properties: { startDate: { type: 'string', format: 'date' }, endDate: { type: 'string', format: 'date' } } } })
  async getAnalytics(@Body() body: { startDate: string; endDate: string }) {
    return this.logService.getAnalytics(new Date(body.startDate), new Date(body.endDate));
  }
}
