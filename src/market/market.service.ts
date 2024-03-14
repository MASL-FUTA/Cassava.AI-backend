import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MarketService {
  constructor(private prisma: PrismaService) {}

  async getMarketItems(page: number = 1) {
    try {
      const items = await this.prisma.inventory.findMany({
        where: {
          listed: true,
        },
        select: {
          name: true,
          farm: {
            select: {
              name: true,
            },
          },
          farmer: {
            select: {
              username: true,
              email: true,
              phone_number: true,
            },
          },
          quantity: true,
          price: true,
          harvestDate: true,
          type: true,
          unit: true,
        },
        take: 10,
        skip: (page - 1) * 10,
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
      const item = await this.prisma.inventory.findUnique({
        where: {
          id: itemid,
          listed: true,
        },
        select: {
          name: true,
          farm: {
            select: {
              name: true,
            },
          },
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

  async getSeller(inventoryId: string, farmId: string) {
    try {
      const seller = await this.prisma.inventory.findFirst({
        where: {
          farmId: farmId,
          id: inventoryId,
        },
        select: {
          farmer: {
            select: {
              username: true,
              email: true,
              phone_number: true,
            },
          },
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

  // async getSellerDetails(itemid: string) {
  //   try {
  //     const seller = await this.prisma.inventory.findUnique({
  //       where: {
  //         id: itemid,
  //       },
  //       select: {
  //         farm: {
  //           select: {
  //             farmer: {
  //               select: {
  //                 username: true,
  //                 email: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });

  //     if (!seller) {
  //       throw new InternalServerErrorException(
  //         'Seller Information could not be retrieved',
  //       );
  //     }

  //     return {
  //       message: 'Seller info retrieved',
  //       status: 'success',
  //       statusCode: 200,
  //       data: seller,
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  async approveItem(inventoryId: string) {
    try {
      const item = await this.prisma.inventory.update({
        where: {
          id: inventoryId,
        },
        data: {
          status: 'approved',
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
      const search = await this.prisma.inventory.findMany({
        where: {
          OR: [
            {
              name: {
                contains: term,
              },
            },
            {
              farmer: {
                username: {
                  contains: term,
                },
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
