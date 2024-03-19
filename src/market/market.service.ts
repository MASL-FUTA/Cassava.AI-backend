import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMarketDto } from './dto/createMarket.dto';

@Injectable()
export class MarketService {
  constructor(private prisma: PrismaService) {}

  async addToMarket(dto: CreateMarketDto) {
    try {
      const market = await this.prisma.market.create({
        data: {
          name: dto.name,
          username: dto.username,
          email: dto.email,
          price: dto.price,
          phoneNumber: dto.phoneNumber,
          type: dto.type,
          unit: dto.unit,
          harvestDate: dto.harvestDate,
          quantity: dto.quantity,
        },
      });

      if (!market) {
        throw new InternalServerErrorException('Could not be added to market');
      }

      return {
        message: 'Produce added to Market',
        status: 'success',
        statusCode: 200,
        data: market,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllMarketItems(page: number = 1) {
    try {
      const items = await this.prisma.market.findMany({
        skip: (page - 1) * 10,
        take: 10,
      });

      if (!items) {
        throw new InternalServerErrorException('Items could not be retrieved');
      }

      return {
        message: 'Items retrieved',
        status: 'success',
        statusCode: 200,
        data: items,
        page,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getApprovedMarketItems(page: number = 1) {
    try {
      // const items = await this.prisma.inventory.findMany({
      //   where: {
      //     listed: true,
      //   },
      //   select: {
      //     name: true,
      //     farm: {
      //       select: {
      //         name: true,
      //       },
      //     },
      //     farmer: {
      //       select: {
      //         username: true,
      //         email: true,
      //         phone_number: true,
      //       },
      //     },
      //     quantity: true,
      //     price: true,
      //     harvestDate: true,
      //     type: true,
      //     unit: true,
      //   },
      //   take: 10,
      //   skip: (page - 1) * 10,
      // });

      const items = await this.prisma.market.findMany({
        where: {
          status: 'approved',
        },
        skip: (page - 1) * 10,
        take: 10,
      });

      if (!items) {
        throw new InternalServerErrorException('Items could not be retrieved');
      }

      return {
        message: 'Market Items retrieved',
        status: 'success',
        statusCode: 200,
        data: items,
        page,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getMarketItem(itemid: string) {
    try {
      const item = await this.prisma.market.findUnique({
        where: {
          id: itemid,
          listed: true,
        },
        select: {
          name: true,
          username: true,
          email: true,
          phoneNumber: true,
          quantity: true,
          price: true,
          harvestDate: true,
          type: true,
          unit: true,
        },
      });

      if (!item) {
        throw new NotFoundException('Item could not be found');
      }

      return {
        message: 'Item retrieved',
        status: 'success',
        statusCode: 200,
        data: item,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getSeller(itemid: string) {
    try {
      const seller = await this.prisma.market.findFirst({
        where: {
          id: itemid,
        },
        select: {
          username: true,
          email: true,
          phoneNumber: true,
        },
      });

      if (!seller) {
        throw new InternalServerErrorException(
          'Seller Info could not be retrieved',
        );
      }

      return {
        message: 'Seller Info Retrieved successfully',
        status: 'success',
        statusCode: 200,
        data: seller,
      };
    } catch (error) {
      throw error;
    }
  }

  async approveItem(itemid: string) {
    try {
      const item = await this.prisma.market.update({
        where: {
          id: itemid,
        },
        data: {
          status: 'approved',
          listed: true,
        },
      });

      if (!item) {
        throw new InternalServerErrorException('Item could not be approved');
      }

      return {
        message: 'Item approved',
        status: 'success',
        statusCode: 200,
        data: item,
      };
    } catch (error) {
      throw error;
    }
  }

  async search(term: string, page?: number) {
    try {
      const search = await this.prisma.market.findMany({
        where: {
          OR: [
            {
              name: {
                contains: term,
              },
            },
            {
              username: {
                contains: term,
              },
            },
            {
              type: {
                contains: term,
              },
            },
          ],
        },
        take: 10,
        skip: (page - 1) * 10,
      });

      if (!search) {
        throw new InternalServerErrorException('No item found');
      }

      return {
        message: 'Item found',
        status: 'success',
        statusCode: 200,
        data: search,
        page,
      };
    } catch (error) {
      throw error;
    }
  }
}
