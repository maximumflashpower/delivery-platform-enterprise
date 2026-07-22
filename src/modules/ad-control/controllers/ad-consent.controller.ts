import { Controller, Get, Post, Patch, Delete, Query, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AdConsentService } from '../services/ad-consent.service';
import { CreateAdConsentRecordDto } from '../dto/create-ad-consent-record.dto';
import { UpdateAdConsentRecordDto } from '../dto/update-ad-consent-record.dto';

@ApiTags('Ad Consent Records')
@ApiBearerAuth()
@Controller('privacy-consent/ad-consents')
export class AdConsentController {
  constructor(private readonly service: AdConsentService) {}

  @Get()
  @ApiOperation({ summary: 'List all ad consent records' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'adCategory', required: false })
  @ApiQuery({ name: 'consentType', required: false })
  findAll(@Query('userId') userId?: string, @Query('adCategory') adCategory?: string, @Query('consentType') consentType?: string) {
    return this.service.findAll(userId, adCategory, consentType);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all consent records for a user' })
  findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single consent record by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new ad consent record' })
  create(@Body() dto: CreateAdConsentRecordDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a consent record' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAdConsentRecordDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/revoke')
  @ApiOperation({ summary: 'Revoke a consent' })
  revoke(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.revoke(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a consent record' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
