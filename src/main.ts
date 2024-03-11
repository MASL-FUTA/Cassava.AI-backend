import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import * as process from 'process';
// import * as compression from 'compression';

process.env.GOOGLE_APPLICATION_CREDENTIALS;

initializeApp({
  credential: applicationDefault(),
  projectId: 'farmit',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use();
  await app.listen(process.env.port || 1337);
}
bootstrap();
