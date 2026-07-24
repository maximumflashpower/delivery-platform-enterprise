import { Controller, Get, Post, Patch, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreativeMarketplaceService } from '../services/creative-marketplace.service';
import { CreateListingDto, UpdateListingDto, BookListingDto, SubmitReviewDto } from '../dto/creative-listing.dto';

@ApiTags('Creative Production Marketplace')
@Controller('local-services/creative-marketplace')
export class CreativeMarketplaceController {
  constructor(private readonly service: CreativeMarketplaceService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get marketplace stats' })
  async getStats() {
    return this.service.getStats();
  }

  @Get('top-creators')
  @ApiOperation({ summary: 'Get top rated creators' })
  async getTopCreators(@Query('limit') limit?: string) {
    return this.service.getTopCreators(limit ? parseInt(limit) : 10);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Browse listings by category' })
  async getByCategory(@Param('category') category: string) {
    return this.service.getByCategory(category);
  }

  @Get()
  @ApiOperation({ summary: 'List all creative listings' })
  async list(
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('creatorId') creatorId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.service.findAll({
      category,
      status,
      creatorId,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get listing by ID' })
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create creative listing' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateListingDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update listing' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateListingDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish listing' })
  async publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.publish(id);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause listing' })
  async pause(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.pause(id);
  }

  @Post(':id/book')
  @ApiOperation({ summary: 'Book creative service' })
  async book(@Param('id', ParseUUIDPipe) id: string, @Body() dto: BookListingDto) {
    return this.service.book(id, dto);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark project as completed' })
  async complete(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.completeProject(id);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive listing' })
  async archive(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.archive(id);
  }

  @Post(':id/reviews')
  @ApiOperation({ summary: 'Add review' })
  async addReview(@Param('id', ParseUUIDPipe) id: string, @Body() dto: SubmitReviewDto) {
    return this.service.addReview(id, dto);
  }
}
