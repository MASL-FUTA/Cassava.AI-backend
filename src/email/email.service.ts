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

  private async sendVerificationEmail(data: any) {
    try {
      const { email, name, token } = data;

      const subject = `Welcome to Farmit!, ${name}`;

      await this.mailerService.sendMail({
        to: email,
        subject,
        template: './welcome-verify',
        context: {
          name,
          token,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Verification Email could not be sent.',
      );
    }
  }

  @OnEvent('verification-email')
  async handleVerificationEmail(data: any) {
    await this.sendVerificationEmail(data);
  }
}
