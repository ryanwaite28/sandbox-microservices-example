import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service';
import {
  MediaAdd,
  MediaInfo,
} from '@app/lib-shared';



@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService
  ) {}

  @Get(`media`)
  getAllMedias() {
    return this.appService.getAllMedias();
  }

  @Get(`media/:id`)
  getMediaById(@Param('id', ParseIntPipe) media_id: number) {
    return this.appService.getMediaObject(media_id);
  }

  @Get(`media/:id/download`)
  async downloadMedia(@Param('id', ParseIntPipe) media_id: number, @Res({ passthrough: true }) response: Response) {
    const media = await this.appService.getMediaFile(media_id);
    response.set({
      'Content-Type': media.type,
      'Content-Disposition': `attachment; filename="${media.name}"`,
    });
    return media.file;
  }

  @Get(`media/:id/serve`)
  async serveMedia(@Param('id', ParseIntPipe) media_id: number, @Res({ passthrough: true }) response: Response) {
    const media = await this.appService.getMediaFile(media_id);
    response.set({
      'Content-Type': media.type,
    });
    return media.file;
  }

  @Post('media')
  startUpload(@Body() mediaInfo: MediaInfo) {
    return this.appService.startUpload(mediaInfo);
  }

  @Post('media/:id')
  addUpload(@Param('id', ParseIntPipe) media_id: number, @Body() data: MediaAdd) {
    return this.appService.addUpload(media_id, data.index, data.chunks);
  }

  @Put('media/:id')
  doneUpload(@Param('id', ParseIntPipe) media_id: number, @Body() data: { chunks: number }) {
    return this.appService.doneUpload(media_id, data);
  }

}
