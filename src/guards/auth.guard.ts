import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGaurd implements CanActivate {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenHeader(request);
    if (!token) {
      throw new UnauthorizedException('Please Login.');
    }

    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Please Login.');
    }

    return true;
  }

  private extractTokenHeader(req: Request): string | undefined {
    try {
      const [type, token] = req.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    } catch (error) {
      throw new InternalServerErrorException('Token could not be retrieved');
    }
  }
}
