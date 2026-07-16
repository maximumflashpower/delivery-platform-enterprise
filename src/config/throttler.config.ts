import { registerAs } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

export default registerAs('throttler', (): ThrottlerModuleOptions => [
  {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10) * 1000,
    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
  },
]);
