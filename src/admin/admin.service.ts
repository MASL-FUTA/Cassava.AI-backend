import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(page: number) {
    try {
      const users = await this.prisma.user.findMany({
        take: 25,
        skip: (page - 1) * 25,
      });

      if (!users) {
        throw new InternalServerErrorException('Users could not be retrieved');
      }

      return {
        message: 'Users retrieved',
        status: 'success',
        statusCode: 200,
        data: users,
        page,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllFarms(page: number) {
    try {
      const farms = await this.prisma.user.findMany({
        take: 25,
        skip: (page - 1) * 25,
      });

      if (!farms) {
        throw new InternalServerErrorException('Farms retrieved');
      }

      return {
        message: 'Farms retrieved',
        status: 'success',
        statusCode: 200,
        data: farms,
        page,
      };
    } catch (error) {
      throw error;
    }
  }
}
