import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeApp, applicationDefault } from 'firebase-admin/app';

process.env.GOOGLE_APPLICATION_CREDENTIALS;

initializeApp({
  credential: applicationDefault(),
  projectId: 'farmit',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
