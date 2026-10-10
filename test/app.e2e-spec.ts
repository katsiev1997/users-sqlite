import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { UserController } from '../src/user/user.controller.js';
import { UserService } from '../src/user/user.service.js';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: vi.fn().mockResolvedValue({
              data: [],
              meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /users returns paginated payload', () => {
    return request(app.getHttpServer())
      .get('/users?page=1&limit=10')
      .expect(200)
      .expect({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } });
  });
});
