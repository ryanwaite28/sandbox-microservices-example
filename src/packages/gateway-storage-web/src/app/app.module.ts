import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { REDIS_DI_PROVIDER } from './redis.client';
import { STORAGE_DB_PROVIDER } from './app.models';
import { RMQ_PROVIDER } from './rmq.client';



@Module({
  imports: [

  ],
  controllers: [
    AppController
  ],
  providers: [
    REDIS_DI_PROVIDER,
    STORAGE_DB_PROVIDER,
    RMQ_PROVIDER,
    AppService
  ],
})
export class AppModule {}
