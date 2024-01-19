/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { urlencoded, json } from 'express';
import { AppModule } from './app/app.module';
import {
  ExpressAdapter,
  NestExpressApplication
} from '@nestjs/platform-express';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), { rawBody: true });
  app.enableCors();
  const globalPrefix = 'storage';
  app.setGlobalPrefix(globalPrefix);
  app.useBodyParser('json', { limit: '150mb' });
  app.use(urlencoded({ extended: true, limit: '150mb' }));
  const port = process.env.PORT || 4000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
