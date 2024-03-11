import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MarketService } from './market.service';
import { Public } from 'src/decorators';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  @HttpCode(200)
  @Public()
  getMarketItems(@Query('page', ParseIntPipe) page?: number) {
    return this.marketService.getMarketItems(page);
  }

  @Get('/:id')
  @HttpCode(200)
  @Public()
  getMarketItem(@Param('id') id: string) {
    return this.marketService.getMarketItem(id);
  }

  @Get('/:id/sellerinfo')
  @HttpCode(200)
  @Public()
  getSellerInfo(@Param('id') id: string) {
    return this.marketService.getSellerDetails(id);
  }
}
