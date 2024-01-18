import { Controller, Body, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  async sendPushNotification(@Body() notificationData: any): Promise<void> {
    const { deviceToken, payload } = notificationData;

    await this.notificationsService.sendPushNotification(deviceToken, payload);
  }
}
