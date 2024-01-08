import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';

export interface Email {
  to: string;
  data: any;
}

@Injectable()
export class EmailService {
  constructor(
    private config: ConfigService,
    private mailerService: MailerService,
  ) {}

  private async sendVerificationEmail(email_data: any) {
    try {
      const { data } = email_data;

      const subject = `Hi!, ${data.name}`;

      await this.mailerService.sendMail({
        to: email_data.to,
        subject,
        template: './send-verification',
        context: {
          name: data.name,
          token: data.token,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Verification Email could not be sent.',
      );
    }
  }

  private async sendWelcomeEmail(email_data: any) {
    try {
      const { data } = email_data;

      const subject = `Welcome to Farmit!, ${data.name}`;

      console.log(subject);

      await this.mailerService.sendMail({
        to: email_data.to,
        subject,
        template: './welcome-email',
        context: {
          name: data.name,
        },
      });
    } catch (error) {
      console.error('Welcome Email could not be sent');
      console.error(error);
    }
  }

  @OnEvent('send-verification')
  async handleVerificationEmail(data: any) {
    await this.sendVerificationEmail(data);
  }

  @OnEvent('welcome-email')
  async handleWelcomeEmail(data: any) {
    await this.sendWelcomeEmail(data);
  }
}
