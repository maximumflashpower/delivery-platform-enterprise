import { SetMetadata } from '@nestjs/common';
export const SKIP_THROTTLE = 'skipThrottle';
export const SkipThrottle = () => SetMetadata(SKIP_THROTTLE, true);
