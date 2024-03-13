import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFarmDto, UpdateFarmDto } from './dto';
import { UserEntity } from 'src/common/shared/userEntity';

@Injectable()
export class FarmService {
  constructor(private prisma: PrismaService) {}

  async createFarm(user: UserEntity, dto: CreateFarmDto) {
    try {
      const newFarm = await this.prisma.farm.create({
        data: {
          farmer: {
            connect: {
              id: user.sub,
            },
          },
          name: dto.name,
          location: dto.location,
          size: dto.size,
          size_unit: dto.size_unit,
          status: dto.status,
          soil: dto.soilInfo,
        },
      });

      if (!newFarm) {
        throw new InternalServerErrorException('Farm could not be added.');
      }

      await this.prisma.user.update({
        where: {
          id: user.sub,
        },
        data: {
          farms: {
            connect: {
              id: newFarm.id,
            },
          },
          role: 'farmer',
        },
      });

      return {
        message: 'Farm created',
        status: 'success',
        statusCode: 201,
        data: newFarm,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Farm could not be added.');
    }
  }

  async getFarms(userid: string) {
    try {
      const farms = await this.prisma.farm.findMany({
        where: {
          farmerId: userid,
        },
        include: {
          tasks: true,
        },
      });

      if (!farms) {
        throw new NotFoundException('No farms found.');
      }

      return {
        message: 'Farms retrieved.',
        status: 'success',
        statusCode: 200,
        data: farms,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Farms could not be retrieved.');
    }
  }

  async getById(userid: string, farmid: string) {
    try {
      const farm = await this.prisma.farm.findUnique({
        where: {
          farmerId: userid,
          id: farmid,
        },
        include: {
          tasks: true,
        },
      });

      if (!farm) {
        throw new NotFoundException('Farm not found.');
      }

      return {
        message: 'Farm retrieved successfully',
        status: 'success',
        statusCode: 200,
        data: farm,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Farm could not be retrieved');
    }
  }

  async updateFarm(userid: string, farmid: string, dto: UpdateFarmDto) {
    try {
      const farm = await this.prisma.farm.update({
        where: {
          id: farmid,
          farmerId: userid,
        },
        data: {
          name: dto.name,
          location: dto.location,
          size: dto.size,
          size_unit: dto.size_unit,
          status: dto.status,
          soil: dto.soil,
        },
      });

      if (!farm) {
        throw new InternalServerErrorException('Farm could not be updated.');
      }

      return {
        message: 'Farm updated successfully',
        status: 'success',
        statusCode: 200,
        data: farm,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Farm could not be updated.');
    }
  }

  async getAllTasks(farmid: string) {
    try {
      const tasks = await this.prisma.farm.findMany({
        where: {
          id: farmid,
        },
        select: {
          tasks: true,
        },
      });

      if (!tasks) {
        throw new NotFoundException('No tasks found for this farm');
      }

      return {
        message: 'Tasks retrieved',
        status: 'success',
        statusCode: 200,
        data: tasks,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Tasks for this farm could not be retrieved',
      );
    }
  }

  async deleteFarm(userid: string, farmid: string) {
    try {
      await this.prisma.farm.delete({
        where: {
          farmerId: userid,
          id: farmid,
        },
      });

      return {
        message: 'Farm deleted successfully',
        status: 'success',
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Farm could not be deleted.');
    }
  }
}
