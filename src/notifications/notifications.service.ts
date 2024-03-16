import { Injectable } from '@nestjs/common';
import { getMessaging } from 'firebase-admin/messaging';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NotificationsService {
  private notificationPayload: any;
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 12 * * * ')
  fiveDaysCron() {
    this.sendPushNotification(new Date().getDate() + 5, 5);
  }

  @Cron('0 12 * * *')
  threeDaysCron() {
    this.sendPushNotification(new Date().getDate() + 3, 3);
  }

  @Cron('0 12 * * *')
  todayCron() {
    this.sendPushNotification(new Date().getDate());
  }

  async sendPushNotification(deadline: any, days: number = 0): Promise<void> {
    // const tasks = await this.prisma.task.findMany({
    //   where: {
    //     due_date: {
    //       lte: deadline,
    //     },
    //   },
    //   include: {
    //     farm: {
    //       select: {
    //         farmer: {
    //           select: {
    //             deviceTokens: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });
    // if (tasks.length === 0) {
    //   console.log('No tasks with approaching deadlines');
    //   return;
    // }
    // if (days === 0) {
    //   this.notificationPayload = {
    //     notification: {
    //       title: 'Complete your Tasks',
    //       body: `Your tasks are due today, please complete them in time.`,
    //     },
    //   };
    // } else {
    //   this.notificationPayload = {
    //     notification: {
    //       title: 'Complete your Tasks',
    //       body: `Your tasks are due in ${days} days, please complete them in time.`,
    //     },
    //   };
    // }
    // const messaging = getMessaging();
    // tasks.forEach(async (task) => {
    //   const { farm } = task;
    //   const { farmer } = farm;
    //   if (farmer && farmer.deviceTokens && farmer.deviceTokens.length > 0) {
    //     for (const deviceToken of farmer.deviceTokens) {
    //       const message = { ...this.notificationPayload, token: deviceToken };
    //       try {
    //         const response = await messaging.send(message);
    //         console.log('Notification sent successfully:', response);
    //       } catch (error) {
    //         console.error('Error sending message: error');
    //       }
    //     }
    //   }
    // });
  }
}
