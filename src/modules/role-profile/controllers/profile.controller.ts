import { Controller, Get, Post, Body, Patch, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProfileService } from '../services/profile.service';
import { Profile, ProfileVisibility, ProfileVerificationLevel } from '../entities/profile.entity';

@ApiTags('profiles')
@Controller('api/role-profile/profiles')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get or create profile for user' })
  @ApiResponse({ status: 200, type: Profile })
  getOrCreate(@Param('userId') userId: string): Promise<Profile> {
    return this.service.getOrCreate(userId);
  }

  @Patch('user/:userId')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, type: Profile })
  update(@Param('userId') userId: string, @Body() updates: Partial<Profile>): Promise<Profile> {
    return this.service.update(userId, updates);
  }

  @Post('verify/:userId')
  @ApiOperation({ summary: 'Verify a user profile' })
  @ApiResponse({ status: 200, type: Profile })
  verify(
    @Param('userId') userId: string,
    @Body('level') level: ProfileVerificationLevel,
    @Body('verifiedBy') verifiedBy: string
  ): Promise<Profile> {
    return this.service.verify(userId, level, verifiedBy);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a profile by ID' })
  @ApiResponse({ status: 200, type: Profile })
  findById(@Param('id', ParseUUIDPipe) id: string): Promise<Profile> {
    return this.service.findById(id);
  }

  @Get('public')
  @ApiOperation({ summary: 'Get public profiles' })
  @ApiResponse({ status: 200, type: [Profile] })
  getPublicProfiles(@Query('limit') limit?: number): Promise<Profile[]> {
    return this.service.getPublicProfiles(limit ? parseInt(String(limit)) : 50);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Delete (deactivate) a profile' })
  @ApiResponse({ status: 204 })
  delete(@Param('userId') userId: string): Promise<void> {
    return this.service.delete(userId);
  }
}
