import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RecommendationController],
  providers: [RecommendationService],
  imports: [ConfigModule, PrismaModule],
})
export class RecommendationModule {}
