import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async getProfile(user_email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: user_email,
        },
        select: {
          email: true,
          phone_number: true,
          username: true,
          firstname: true,
          lastname: true,
          farms: true,
          Inventory: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User could not be found');
      }

      return {
        message: 'User data retrieved',
        status: 'success',
        statusCode: 200,
        data: user,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'User data could not be retrieved.',
      );
    }
  }

  async deleteAccount(user_id: string) {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        throw new InternalServerErrorException('User could not be deleted');
      }

      return {
        message: 'Account deleted successfully',
        status: 'success',
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
