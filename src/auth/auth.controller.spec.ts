import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('Should return success JSON', async () => {
      const result = {
        message: 'User registered.',
        status: 'Success',
        statusCode: 201,
        data: {
          email: 'testemail@gmail.com',
          username: 'testuser',
        },
      };
      jest.spyOn(service, 'register').mockImplementation(() => result);

      expect(await controller.register()).toBe(result);
    });
  });
});
