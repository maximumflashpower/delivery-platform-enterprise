import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

describe('Delivery Platform (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health', () => {
    it('/api/health (GET) → 200 status ok', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/health')
        .expect(200);
      expect(res.body).toHaveProperty('status', 'ok');
    });
  });

  describe('Smoke Tests - Empty Arrays', () => {
    const emptyArrayEndpoints = [
      '/api/governance/policies',
      '/api/chat/rooms',
      '/api/wellness/goals',
      '/api/integration/api-keys',
      '/api/ml/models',
      '/api/observability/metrics',
    ];

    emptyArrayEndpoints.forEach((endpoint) => {
      it(`GET ${endpoint} → 200 []`, async () => {
        const res = await request(app.getHttpServer())
          .get(endpoint)
          .expect(200);
        expect(Array.isArray(res.body)).toBe(true);
      });
    });
  });
});
