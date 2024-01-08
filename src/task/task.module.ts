import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [PrismaModule, ConfigModule],
})
export class TaskModule {}
