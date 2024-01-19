import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ResourceDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async getResources() {
    try {
      const resources = await this.prisma.resource.findMany();

      if (!resources) {
        throw new NotFoundException('Resources could not be found.');
      }

      return {
        message: 'Resources Retrieved.',
        status: 'success',
        statusCode: 200,
        data: resources,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Resources could not be retrieved',
      );
    }
  }

  async getResource(id: string) {
    try {
      const resource = await this.prisma.resource.findFirst({
        where: {
          id: id,
        },
      });

      if (!resource) {
        throw new NotFoundException('Resource could not be retrieved');
      }

      return {
        message: 'Resource retrieved successfully',
        status: 'success',
        statusCode: 200,
        data: resource,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Resource could not be retrieved.',
      );
    }
  }

  async addResource(dto: ResourceDto) {
    try {
      const resource = await this.prisma.resource.create({
        data: dto,
      });

      if (!resource) {
        throw new InternalServerErrorException(
          'Resource could not be created.',
        );
      }

      return {
        message: 'Resource created.',
        status: 'success',
        statusCode: 200,
        data: resource,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Resource could not be created');
    }
  }

  async deleteResource(id: string) {
    try {
      const resource = await this.prisma.resource.delete({
        where: {
          id: id,
        },
      });

      if (!resource) {
        throw new InternalServerErrorException('Resource could not be deleted');
      }

      return {
        message: 'Resource deleted',
        status: 'success',
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Resource could not be deleted');
    }
  }
}
