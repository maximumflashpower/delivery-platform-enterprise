import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserDataRequestService } from '../services/user-data-request.service';
import { UserDataRequest, RequestType } from '../entities/user-data-request.entity';

@ApiTags('user-data-requests')
@Controller('api/privacy-consent/requests')
export class UserDataRequestController {
  constructor(private readonly service: UserDataRequestService) {}

  @Post('submit')
  @ApiOperation({ summary: 'Submit a new data request (DSAR)' })
  @ApiResponse({ status: 201, type: UserDataRequest })
  submit(
    @Body('userId') userId: string,
    @Body('type') type: RequestType,
    @Body('details') details?: string
  ): Promise<UserDataRequest> {
    return this.service.submit(userId, type, details);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all requests for a user' })
  @ApiResponse({ status: 200, type: [UserDataRequest] })
  findAllByUser(@Param('userId') userId: string): Promise<UserDataRequest[]> {
    return this.service.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific request' })
  @ApiResponse({ status: 200, type: UserDataRequest })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserDataRequest> {
    return this.service.findOne(id);
  }

  @Patch(':id/start')
  @ApiOperation({ summary: 'Start processing a request' })
  @ApiResponse({ status: 200, type: UserDataRequest })
  startProcessing(@Param('id', ParseUUIDPipe) id: string): Promise<UserDataRequest> {
    return this.service.startProcessing(id);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Complete a request' })
  @ApiResponse({ status: 200, type: UserDataRequest })
  complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('processedBy') processedBy: string,
    @Body('deliveryUrl') deliveryUrl?: string
  ): Promise<UserDataRequest> {
    return this.service.complete(id, processedBy, deliveryUrl);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject a request' })
  @ApiResponse({ status: 200, type: UserDataRequest })
  reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('processedBy') processedBy: string,
    @Body('reason') reason: string
  ): Promise<UserDataRequest> {
    return this.service.reject(id, processedBy, reason);
  }
}
