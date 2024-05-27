import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, Res } from '@nestjs/common';
import type { Response } from 'express';

import { BlogService } from './blog.service';
import { rmqClient } from '../rmq.client';
import { MicroservicesQueues, MicroservicesStorageRequests } from '@app/lib-backend';
import { MediaObject } from '@app/lib-shared';
import { ContentTypes, RmqEventMessage } from 'rxjs-rabbitmq';



@Controller('blog')
export class BlogController {

  constructor(
    private readonly blogService: BlogService
  ) {}

  

}
