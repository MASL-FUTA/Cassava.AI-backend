import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [PrismaModule, ConfigModule],
})
export class ProfileModule {}
