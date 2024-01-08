import { Module } from '@nestjs/common';
import { FarmService } from './farm.service';
import { FarmController } from './farm.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FarmController],
  providers: [FarmService],
  imports: [PrismaModule],
})
export class FarmModule {}
