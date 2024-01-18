import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [ConfigModule],
})
export class NotificationsModule {}
