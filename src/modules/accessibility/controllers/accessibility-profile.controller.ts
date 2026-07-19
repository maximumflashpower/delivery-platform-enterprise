import { ApiTags } from '@nestjs/swagger';
import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { AccessibilityProfileService } from '../services/accessibility-profile.service';
import { AccessibilityProfile } from '../entities/accessibility-profile.entity';

@ApiTags('Accessibility')
@Controller('accessibility/profiles')
export class AccessibilityProfileController {
  constructor(private readonly profileService: AccessibilityProfileService) {}

  @PublicRoute()
  @Get()
  findAll(@Query('userId') userId?: string): Promise<AccessibilityProfile[]> {
    return this.profileService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AccessibilityProfile | null> {
    return this.profileService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<AccessibilityProfile>): Promise<AccessibilityProfile> {
    return this.profileService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<AccessibilityProfile>): Promise<AccessibilityProfile | null> {
    return this.profileService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.profileService.remove(id);
  }
}
