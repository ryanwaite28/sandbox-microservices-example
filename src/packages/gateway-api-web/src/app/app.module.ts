import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RMQ_PROVIDER } from './rmq.client';

@Module({
  imports: [],
  controllers: [
    AppController
  ],
  providers: [
    RMQ_PROVIDER,
    AppService
  ],
})
export class AppModule {}
