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
          username: data.name,
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

      const subject = `Welcome to CassavaMax!, ${data.name}`;

      console.log(subject);

      await this.mailerService.sendMail({
        to: email_data.to,
        subject,
        template: './welcome-email',
        context: {
          username: data.name,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Welcome email could not be sent.',
      );
    }
  }

  private async sendPasswordResetEmail(email_data: any) {
    try {
      const { data } = email_data;

      await this.mailerService.sendMail({
        to: email_data.to,
        subject: 'Password Reset',
        template: './password-reset',
        context: {
          username: data.name,
        },
      });
    } catch (error) {
      console.error('Password reset email not sent.');
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

  @OnEvent('password-reset')
  async handlePasswordResetEmail(data: any) {
    await this.sendPasswordResetEmail(data);
  }
}
