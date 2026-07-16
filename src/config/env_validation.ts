import { plainToClass } from 'class-transformer';
import { IsString, IsPort, IsNotEmpty, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import * as dotenv from 'dotenv';

dotenv.config();

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  NODE_ENV: string;

  @IsPort()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  API_PREFIX: string;

  // Database
  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsPort()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DB_DATABASE: string;

  @IsBoolean()
  DB_SYNCHRONIZE: boolean;

  @IsBoolean()
  DB_LOGGING: boolean;

  // Redis
  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;

  @IsPort()
  REDIS_PORT: number;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string;

  // JWT
  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_EXPIRES_IN: string;

  // Logging
  @IsString()
  @IsNotEmpty()
  LOG_LEVEL: string;

  @IsString()
  @IsNotEmpty()
  LOG_FORMAT: string;

  // Throttle
  @IsPort()
  THROTTLE_TTL: number;

  @IsPort()
  THROTTLE_LIMIT: number;

  // Swagger
  @IsBoolean()
  SWAGGER_ENABLED: boolean;

  @IsString()
  @IsNotEmpty()
  SWAGGER_TITLE: string;

  @IsString()
  @IsNotEmpty()
  SWAGGER_VERSION: string;
}

export function validate(config: Record<string, unknown>): void {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validatedConfig.constructor.prototype.validate(validatedConfig);

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
}
