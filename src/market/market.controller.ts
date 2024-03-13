import {
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { MarketService } from './market.service';
import { Public } from 'src/decorators';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  @HttpCode(200)
  @Public()
  @UseInterceptors(CacheInterceptor)
  getMarketItems(@Query('page') page: number = 1) {
    return this.marketService.getMarketItems(page);
  }

  @Get('/:id')
  @HttpCode(200)
  @Public()
  @UseInterceptors(CacheInterceptor)
  getMarketItem(@Param('id') id: string) {
    return this.marketService.getMarketItem(id);
  }

  @Get('/:farmid/:id/sellerinfo')
  @HttpCode(200)
  @Public()
  getSellerInfo(@Param('id') id: string, @Param('farmid') farmId: string) {
    return this.marketService.getSeller(id, farmId);
  }

  @Get('/:inventoryId/approve')
  @HttpCode(200)
  approveItem(@Param('inventoryId') inventoryId: string) {
    return this.marketService.approveItem(inventoryId);
  }

  @Get('/search/market')
  @HttpCode(200)
  @Public()
  @UseInterceptors(CacheInterceptor)
  search(@Query('term') term: string, @Query('page') page: number = 1) {
    return this.marketService.search(term, page);
  }
}
