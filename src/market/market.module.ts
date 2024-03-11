import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [MarketController],
  providers: [MarketService],
  imports: [PrismaModule],
})
export class MarketModule {}
