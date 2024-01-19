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

  @Get(`media`)
  async getMediaAll() {
    console.log(`--- Requesting media objects all`);

    const response: RmqEventMessage<MediaObject> = await rmqClient.sendRequest({
      queue: MicroservicesQueues.STORAGE,
      data: {  },
      publishOptions: {
        type: MicroservicesStorageRequests.MEDIA_GET_ALL,
        contentType: ContentTypes.JSON,
      }
    });

    console.log(`--- Received media objects:`, { response });
    
    response.ack();

    return response.data;
  }

  @Get(`media/:id`)
  async getMediaById(@Param('id', ParseIntPipe) id: number) {
    console.log(`--- Requesting media object by id:`, { id });

    const response: RmqEventMessage<MediaObject> = await rmqClient.sendRequest({
      queue: MicroservicesQueues.STORAGE,
      data: { id },
      publishOptions: {
        type: MicroservicesStorageRequests.MEDIA_GET_BY_ID,
        contentType: ContentTypes.JSON,
      }
    });

    console.log(`--- Received media object:`, { response });
    
    response.ack();

    return response.data;
  }

}
