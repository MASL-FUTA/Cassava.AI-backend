import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum';
import { CreateUserDto, LoginDto } from '../src/auth/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3030);

    pactum.request.setBaseUrl('http:localhost:3030');
  });

  describe('Auth', () => {
    describe('Register', () => {
      it('Register', () => {
        const dto: CreateUserDto = {
          email: 'Testuser@mail.com',
          username: 'testuser',
          password: '1234',
          firstname: 'Test',
          lastname: 'User',
        };

        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Login', () => {
      it('Login', async () => {
        const dto: LoginDto = {
          email: 'Testuser@mail.com',
          password: '1234',
        };

        const response = await pactum
          .spec()
          .post('auth/login')
          .withBody(dto)
          .expectStatus(200)
          .end();

        authToken = response.body.access_token;

        return response;
      });
    });

    describe('Forgot Password', () => {
      it('Forgot Password Route', () => {
        const payload: any = {
          email: 'Testuser@mail.com',
        };

        return pactum
          .spec()
          .post('/auth/forgotPassword')
          .withBody(payload)
          .expectStatus(200);
      });
    });

    describe('Reset Password', () => {
      it('Reset Password', () => {});
    });
  });
});
