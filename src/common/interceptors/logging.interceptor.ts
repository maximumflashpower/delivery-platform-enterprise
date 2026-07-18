import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, ip, headers } = request;

    // Correlation ID
    const correlationId = headers['x-correlation-id'] || uuidv4();
    request.correlationId = correlationId;
    response.setHeader('X-Correlation-ID', correlationId);

    const userAgent = headers['user-agent'] || 'unknown';
    const startTime = Date.now();

    this.logger.log(`→ ${method} ${url} | IP: ${ip} | UA: ${userAgent} | CID: ${correlationId}`);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;
          this.logger.log(
            `← ${method} ${url} | ${statusCode} | ${duration}ms | CID: ${correlationId}`,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;
          this.logger.error(
            `← ${method} ${url} | ${statusCode} | ${duration}ms | CID: ${correlationId} | Error: ${error.message}`,
            error.stack,
          );
        },
      }),
    );
  }
}
