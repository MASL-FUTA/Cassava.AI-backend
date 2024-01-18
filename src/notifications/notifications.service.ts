import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
// import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly config: ConfigService) {}

  async sendPushNotification(
    deviceToken: any,
    payload: NotificationDto,
  ): Promise<void> {
    const message = {
      notification: payload,
      token: deviceToken,
    };

    getMessaging()
      .send(message)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }
}
