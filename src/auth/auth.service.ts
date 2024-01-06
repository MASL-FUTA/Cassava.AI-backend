import {
  Body,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/decorators';
import { CreateUserDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
    private readonly emitter: EventEmitter2,
  ) {}

  @Public()
  async register(@Body() dto: CreateUserDto) {
    try {
      const passwordhash = await argon.hash(dto.password);

      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          firstname: dto.firstname,
          lastname: dto.lastname,
          passwordhash: passwordhash,
          verified: false,
        },
        select: {
          email: true,
          username: true,
        },
      });

      if (!newUser) {
        throw new InternalServerErrorException('User could not registered.');
      }

      const email_data = {};

      await this.emitter.emit('verification-email', email_data);

      return {
        message: 'User registered.',
        status: 'Success',
        statusCode: 201,
        data: newUser,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Registration failed.');
    }
  }
}
