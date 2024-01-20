import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Res,
  ParseIntPipe,
  StreamableFile,
  Query,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service';
import {
  MediaAdd,
  MediaInfo,
  MediaObject,
} from '@app/lib-shared';
import { rmqClient } from './rmq.client';
import {
  MicroservicesQueues,
  MicroservicesStorageRequests
} from '@app/lib-backend';
import { ContentTypes, RmqEventMessage } from 'rxjs-rabbitmq';
import { join } from 'path';
import { createReadStream } from 'fs';



@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService
  ) {}

  @Get(`media`)
  getAllMedias() {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.STORAGE,
      data: {},
      publishOptions: {
        type: MicroservicesStorageRequests.MEDIA_GET_ALL,
        contentType: ContentTypes.JSON,
      }
    })
    .then((rmqMessage: RmqEventMessage<MediaObject[]>) => {
      rmqMessage.ack();
      return { data: rmqMessage.data };
    });
  }

  @Get(`media/:id`)
  getMediaById(@Param('id', ParseIntPipe) media_id: number) {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.STORAGE,
      data: { id: media_id },
      publishOptions: {
        type: MicroservicesStorageRequests.MEDIA_GET_BY_ID,
        contentType: ContentTypes.JSON,
      }
    })
    .then((rmqMessage: RmqEventMessage<MediaObject>) => {
      rmqMessage.ack();
      return { data: rmqMessage.data };
    });
  }

  @Get(`media/:id/content`)
  async downloadMedia(
    @Param('id', ParseIntPipe) media_id: number,
    @Query('mode') mode: string,
    @Res({ passthrough: true }) response: Response
  ) {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.STORAGE,
      data: { id: media_id },
      publishOptions: {
        type: MicroservicesStorageRequests.MEDIA_GET_BY_ID,
        contentType: ContentTypes.JSON,
      }
    })
    .then((rmqMessage: RmqEventMessage<MediaObject>) => {
      const mediaObject: MediaObject = rmqMessage.data;
      const response_headers = {
        'Content-Type': mediaObject.type,
      };
      if (mode && mode === 'download') {
        response_headers['Content-Disposition'] = `attachment; filename="${mediaObject.key}.${mediaObject.extension}"`;
      }
      response.set(response_headers);
      const fileName = `${mediaObject.key}.${mediaObject.extension}`;
      const filePath = join(process.env['SHARED_STORAGE_VOL_PATH'] || __dirname, fileName);
      const file = createReadStream(filePath);
      rmqMessage.ack();
      return new StreamableFile(file);
    });
  }

  @Post('media')
  startUpload(@Body() mediaInfo: MediaInfo) {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.STORAGE,
      data: mediaInfo,
      publishOptions: {
        type: MicroservicesStorageRequests.MEDIA_START,
        contentType: ContentTypes.JSON,
      }
    })
    .then((rmqMessage: RmqEventMessage<MediaObject>) => {
      rmqMessage.ack();
      return { data: rmqMessage.data };
    });
  }

  @Post('media/:id')
  addUpload(@Param('id', ParseIntPipe) media_id: number, @Body() data: MediaAdd, @Res({ passthrough: true }) response: Response) {
    rmqClient.sendMessage({
      queue: MicroservicesQueues.STORAGE,
      data: { ...data, id: media_id },
      publishOptions: {
        type: MicroservicesStorageRequests.MEDIA_PROGRESS,
        contentType: ContentTypes.JSON,
      }
    });

    response.status(HttpStatus.OK);

    return { message: `Sent for processing` };
  }

}
