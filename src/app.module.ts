import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TaskModule } from './task/task.module';
import { FarmModule } from './farm/farm.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGaurd } from './guards/auth.guard';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    AuthModule,
    JwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    PrismaModule,
    EmailModule,
    EventEmitterModule.forRoot(),
    TaskModule,
    FarmModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGaurd,
    },
  ],
})
export class AppModule {}
