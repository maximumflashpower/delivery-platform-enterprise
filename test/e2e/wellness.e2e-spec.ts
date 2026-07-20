import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('WellnessGoalsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET api/wellness/goals - should return 6 goals', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/wellness/goals')
      .expect(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(6);
  });

  it('/GET api/wellness/goals/:id - should return specific goal', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/wellness/goals/d1b2c3d4-0001-4000-8000-000000000001')
      .expect(200);
    expect(res.body.goalName).toBe('Physical Activity Challenge');
    expect(res.body.type).toBe('physical');
  });

  it('/GET api/wellness/goals - should filter by type', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/wellness/goals?type=physical')
      .expect(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });
});

describe('FeatureFlagsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET api/feature-flags - should return 5 flags', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/feature-flags')
      .expect(200);
    expect(res.body.length).toBe(5);
  });

  it('/GET api/feature-flags/:id - should return specific flag', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/feature-flags/f1b2c3d4-0001-4000-8000-000000000001')
      .expect(200);
    expect(res.body.flagKey).toBe('new_dashboard_ui');
  });
});

describe('ChatRoomsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET api/chat/rooms - should return 4 rooms', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/chat/rooms')
      .expect(200);
    expect(res.body.length).toBe(4);
  });

  it('/GET api/chat/rooms/:id - should return room with participants', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/chat/rooms/c1b2c3d4-0001-4000-8000-000000000001')
      .expect(200);
    expect(res.body.roomName).toBe('General Discussion');
    expect(res.body.type).toBe('broadcast');
  });
});
