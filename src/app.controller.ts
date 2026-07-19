import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicRoute } from './common/decorators/public-route.decorator';
import { SkipThrottle } from './common/decorators/skip-throttle.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @PublicRoute()
  @SkipThrottle()
  @Get('health')
  healthCheck() {
    return this.appService.healthCheck();
  }
}
