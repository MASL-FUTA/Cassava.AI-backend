import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.azure_host,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
          user: process.env.entra_username,
          pass: process.env.entra_password,
        },
      },
      defaults: {
        from: process.env.entra_sender,
      },
      template: {
        dir: './templates',
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
  ],
})
export class EmailModule {}
