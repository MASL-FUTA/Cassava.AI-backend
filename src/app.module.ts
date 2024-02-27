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
import { RecommendationModule } from './recommendation/recommendation.module';
import { ResourcesModule } from './resources/resources.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { InventoryModule } from './inventory/inventory.module';
// import * as admin from 'firebase-admin';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: 'AIzaSyAk3UQZ2X3s6JggisQ9qUggU-4_0RVVQ7A',
//   authDomain: 'farmit-d5cc9.firebaseapp.com',
//   projectId: 'farmit-d5cc9',
//   storageBucket: 'farmit-d5cc9.appspot.com',
//   messagingSenderId: '648516832592',
//   appId: '1:648516832592:web:e50e6b2b03918e45b07055',
//   measurementId: 'G-8XNEY5GMJ3',
// };

// admin.initializeApp({
//   credential: admin.credential.cert(firebaseConfig),
// });

@Module({
  imports: [
    AuthModule,
    JwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '../.env',
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    EmailModule,
    EventEmitterModule.forRoot(),
    TaskModule,
    FarmModule,
    ProfileModule,
    RecommendationModule,
    ResourcesModule,
    NotificationsModule,
    InventoryModule,
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
