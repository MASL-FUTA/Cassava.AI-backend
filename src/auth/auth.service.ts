import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/decorators';
import { CreateUserDto, LoginDto, ForgotPasswordDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
    private readonly emitter: EventEmitter2,
  ) {}

  private async getUserByEmail(user_email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: user_email,
        },
        select: {
          email: true,
          username: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User could not be found.');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Please try again.');
    }
  }

  private randomDigits() {
    return randomBytes(6).toString('hex');
  }

  @Public()
  async register(dto: CreateUserDto) {
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
        message: 'User registered. Please verify your email',
        status: 'Success',
        statusCode: 201,
        data: newUser,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Registration failed.');
    }
  }

  @Public()
  async login(dto: LoginDto): Promise<{ access_token: string } | object> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
        select: {
          id: true,
          email: true,
          username: true,
          passwordhash: true,
          verified: true,
        },
      });

      const match = await argon.verify(user.passwordhash, dto.password);
      if (!match) {
        throw new UnauthorizedException('Invalid password');
      }

      if (!user.verified) {
        return {
          message: 'Please verify your account',
          status: 'success',
          statusCode: 200,
          data: null,
        };
      }

      const payload = {
        sub: user.id,
        email: user.email,
      };
      const token = await this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRE'),
      });

      return {
        access_token: token,
      };
    } catch (error) {
      throw new UnauthorizedException('Login failed, try again.');
    }
  }

  @Public()
  async forgotPassword(dto: ForgotPasswordDto) {
    try {
      const user = await this.getUserByEmail(dto.email);

      const resetToken = this.randomDigits();

      await this.prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          resetToken: resetToken,
        },
      });

      const data = {
        resetToken,
      };

      await this.emitter.emit('send-reset-token', data);

      return {
        message: 'Reset token has been sent to your email',
        status: 'success',
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Retrieving password failed.');
    }
  }
}
