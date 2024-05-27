import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, Res } from '@nestjs/common';
import type { Response } from 'express';

import { AppService } from './app.service';
import { rmqClient } from './rmq.client';
import { MicroservicesQueues, MicroservicesStorageRequests } from '@app/lib-backend';
import { MediaObject } from '@app/lib-shared';
import { ContentTypes, RmqEventMessage } from 'rxjs-rabbitmq';



@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  healthCheck() {
    return { message: `API Gateway Online` };
  }

}
