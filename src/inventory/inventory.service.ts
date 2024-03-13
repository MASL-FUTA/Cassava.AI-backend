import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InventoryDto, UpdateInventoryDto } from './dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async addToInventory(farmId: string, dto: InventoryDto, farmerId: string) {
    try {
      const item = await this.prisma.inventory.create({
        data: {
          farm: {
            connect: {
              id: farmId,
            },
          },
          farmer: {
            connect: {
              id: farmerId,
            },
          },
          harvestDate: dto.harvestDate,
          quantity: dto.quantity,
          price: dto.price,
          name: dto.name,
          type: dto.type,
          unit: dto.unit,
        },
      });

      if (!item) {
        throw new InternalServerErrorException(
          'Harvest could not be added to inventory.',
        );
      }

      return {
        message: 'Harvest successfully added to inventory',
        status: 'success',
        statusCode: 201,
        data: item,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllInventory(farmerId: string, farmId: string, page: number) {
    try {
      const items = await this.prisma.inventory.findMany({
        where: {
          farmId: farmId,
          farmerId: farmerId,
        },
        take: 10,
        skip: (page - 1) * 10,
      });

      if (!items) {
        throw new InternalServerErrorException(
          'Harvest inventory could not be retrieved.',
        );
      }

      return {
        message: 'Harvest inventory retrieved.',
        status: 'success',
        statusCode: 200,
        data: items,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getInventoryById(id: string, farmId: string, farmerId: string) {
    try {
      const item = await this.prisma.inventory.findMany({
        where: {
          id: id,
          farmId: farmId,
          farmerId: farmerId,
        },
      });

      if (!item) {
        throw new InternalServerErrorException(
          'Harvest could not be retrieved from inventory',
        );
      }

      return {
        message: 'Harvest retrieved from inventory',
        status: 'success',
        statusCode: 200,
        data: item,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateInventoryItem(
    id: string,
    farmId: string,
    dto: UpdateInventoryDto,
    farmerId,
  ) {
    try {
      const item = await this.prisma.inventory.update({
        where: {
          id: id,
          farmId: farmId,
          farmerId: farmerId,
        },
        data: dto,
      });

      if (!item) {
        throw new InternalServerErrorException(
          'Harvest could not be updated, try again.',
        );
      }

      return {
        message: 'Harvest updated successfully',
        status: 'success',
        statusCode: 200,
        data: item,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addToMarket(id: string, farmId: string) {
    try {
      const item = await this.prisma.inventory.update({
        where: {
          id: id,
          farmId: farmId,
        },
        data: {
          listed: true,
          status: 'pending',
        },
      });

      if (!item) {
        throw new InternalServerErrorException(
          'Inventory item could not be retrieved.',
        );
      }

      return {
        message: 'Item has been added to market',
        status: 'success',
        statusCode: 200,
        data: item,
      };
    } catch (error) {
      throw error;
    }
  }

  async removeFromMarket(id: string, farmId: string) {
    try {
      const item = await this.prisma.inventory.update({
        where: {
          id: id,
          farmId: farmId,
        },
        data: {
          listed: false,
          status: 'unlisted',
        },
      });

      if (!item) {
        throw new InternalServerErrorException(
          'Item could not be removed from market.',
        );
      }

      return {
        message: 'Item has been added to market',
        status: 'success',
        statusCode: 200,
        data: item,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteInventoryItem(id: string, farmerId: string, farmId: string) {
    try {
      const item = await this.prisma.inventory.delete({
        where: {
          id: id,
          farmId: farmId,
          farmerId: farmerId,
        },
      });

      if (!item) {
        throw new InternalServerErrorException('Harvest could not be deleted');
      }

      return {
        message: 'Harvest deleted successfully',
        status: 'success',
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async clearInventory(farmerId: string, farmId: string) {
    try {
      const items = await this.prisma.inventory.deleteMany({
        where: {
          farmId: farmId,
          farmerId: farmerId,
        },
      });

      if (!items) {
        throw new InternalServerErrorException(
          'Inventory could not be cleared',
        );
      }

      return {
        message: 'Inventory cleared successfully',
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
