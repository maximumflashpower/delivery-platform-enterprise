import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  enabled: process.env.SWAGGER_ENABLED === 'true',
  title: process.env.SWAGGER_TITLE || 'Delivery Platform API',
  version: process.env.SWAGGER_VERSION || 'v1.0.0',
}));
