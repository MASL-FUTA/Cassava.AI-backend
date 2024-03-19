import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { MarketService } from './market.service';
import { Public } from 'src/decorators';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CreateMarketDto } from './dto/createMarket.dto';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post()
  @HttpCode(200)
  @Public()
  addToMarket(@Body() dto: CreateMarketDto) {
    return this.marketService.addToMarket(dto);
  }

  @Get()
  @HttpCode(200)
  @Public()
  @UseInterceptors(CacheInterceptor)
  getAllMarketItems(@Query('page') page: number) {
    return this.marketService.getAllMarketItems(page);
  }

  @Get('/approved')
  @HttpCode(200)
  @Public()
  @UseInterceptors(CacheInterceptor)
  getApprovedMarketItems(@Query('page') page: number = 1) {
    return this.marketService.getApprovedMarketItems(page);
  }

  @Get('/:id')
  @HttpCode(200)
  @Public()
  @UseInterceptors(CacheInterceptor)
  getMarketItem(@Param('id') id: string) {
    return this.marketService.getMarketItem(id);
  }

  @Get('/:id/sellerinfo')
  @HttpCode(200)
  @Public()
  getSellerInfo(@Param('id') id: string) {
    return this.marketService.getSeller(id);
  }

  @Get('/:id/approve')
  @HttpCode(200)
  approveItem(@Param('id') itemId: string) {
    return this.marketService.approveItem(itemId);
  }

  @Get('/search/market')
  @HttpCode(200)
  @Public()
  @UseInterceptors(CacheInterceptor)
  search(@Query('term') term: string, @Query('page') page: number = 1) {
    return this.marketService.search(term, page);
  }
}
