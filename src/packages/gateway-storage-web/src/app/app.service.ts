import { Inject, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { REDIS_DI_TOKEN } from './redis.client';
import { RedisClientType, commandOptions } from 'redis';
import {
  join
} from 'path';
import {
  createReadStream,
  createWriteStream,
  writeFileSync,
} from 'fs';
import { MediaObjects } from './app.models';
import {
  MediaInfo,
  MediaObject,
  StorageVersions,
  UploadStatus
} from '@app/lib-shared';
import { rmqClient } from './rmq.client';
import { MicroservicesExchanges, MicroservicesStorageEvents } from '@app/lib-backend';
import { ContentTypes } from 'rxjs-rabbitmq';



@Injectable()
export class AppService {

  constructor(
    @Inject(REDIS_DI_TOKEN) private redisClient: RedisClientType
  ) {}

  getAllMedias() {
    return MediaObjects.findAll();
  }


  async startUpload(mediaInfo: MediaInfo) {
    const storage_key = Date.now().toString();

    const mediaObject: MediaObject = await MediaObjects.create({
      extension: mediaInfo.ext?.toLowerCase(),
      type: mediaInfo.type,
      size: mediaInfo.size,
      chunks: mediaInfo.chunks,
      version: StorageVersions.V1,
      key: storage_key,
      path: '',
      domain: '',
      url: '',
      status: UploadStatus.STARTED,
    });

    const media_id = mediaObject.id;
    
    const MEDIA_OBJECT_REDIS_KEY = `media-${media_id}-object`;
    await this.redisClient.set(MEDIA_OBJECT_REDIS_KEY, JSON.stringify(mediaObject)).then(() => {
      console.log(`Set key successfully.`, { MEDIA_OBJECT_REDIS_KEY, media_id });
    });
    console.log(`started new media upload: ${media_id}`);

    /*
      In a microservice architecture, we would, at this point, publish an event that a file upload was started
    */
    rmqClient.publishEvent({
      exchange: MicroservicesExchanges.STORAGE_EVENTS,
      routingKey: MicroservicesStorageEvents.FILE_STARTED, // this is the event that a listener can bind a queue to this exchange with
      data: mediaObject,
      publishOptions: {
        type: MicroservicesStorageEvents.FILE_STARTED,
        contentType: ContentTypes.JSON
      }
    });

    return { media_id, data: mediaObject };
  }

  async getMediaObject(media_id: number): Promise<MediaObject> {
    const MEDIA_OBJECT_REDIS_KEY = `media-${media_id}-object`;
    let mediaObject = await this.redisClient.get(MEDIA_OBJECT_REDIS_KEY);
    if (mediaObject) {
      return JSON.parse(mediaObject) as MediaObject;
    }

    mediaObject = await MediaObjects.findByPk(media_id);
    if (!mediaObject) {
      throw new NotFoundException({ message: `Media ID does not exist` });
    }

    await this.redisClient.set(MEDIA_OBJECT_REDIS_KEY, JSON.stringify(mediaObject), { EX: 60 * 60 }).then(() => {
      console.log(`Set media object in cache successfully.`, { MEDIA_OBJECT_REDIS_KEY, media_id });
    });
    return (<any> mediaObject) as MediaObject;
  }

  async addUpload(media_id: number, index: number, chunks: number[]) {
    const mediaObject = await this.getMediaObject(media_id);

    if (mediaObject.status === UploadStatus.STARTED) {
      // updating status
      await MediaObjects.update({ status: UploadStatus.PROGRESS }, { where: { id: media_id } });
      const MEDIA_OBJECT_REDIS_KEY = `media-${media_id}-object`;
      mediaObject.status = UploadStatus.PROGRESS;
      await this.redisClient.set(MEDIA_OBJECT_REDIS_KEY, JSON.stringify(mediaObject)).then(() => {
        console.log(`Set key successfully.`, { MEDIA_OBJECT_REDIS_KEY, media_id });
      });
      /*
        In a microservice architecture, we would, at this point, publish an event that a file was added to
      */
      rmqClient.publishEvent({
        exchange: MicroservicesExchanges.STORAGE_EVENTS,
        routingKey: MicroservicesStorageEvents.FILE_PROGRESS,
        data: mediaObject,
        publishOptions: {
          type: MicroservicesStorageEvents.FILE_PROGRESS,
          contentType: ContentTypes.JSON
        }
      });
    }
    
    const MEDIA_CHUNK_REDIS_KEY: string = `media-${media_id}-chunk-${index}`;
    await this.redisClient.set(MEDIA_CHUNK_REDIS_KEY, Buffer.from(chunks)).then(() => {
      console.log(`Set key successfully.`, { MEDIA_CHUNK_REDIS_KEY, media_id, index });
    });
    return { media_id, index, data: mediaObject, results: `Chunks saved` };
  }

  async doneUpload(media_id: number, data?: { chunks: number }) {
    const mediaObject = await this.getMediaObject(media_id);

    const fileName = `${mediaObject.key}.${mediaObject.extension}`;
    const filePath = join(process.env['SHARED_STORAGE_VOL_PATH'] || __dirname, fileName);
    const file = writeFileSync(filePath, '');
    const fileStream = createWriteStream(filePath, {});

    console.log(`Aggregating chunks via write stream`, { media_id });
    let index = 0;
    while (true) {
      const MEDIA_CHUNK_REDIS_KEY: string = `media-${media_id}-chunk-${index}`;
      const chunks_buffer: Buffer = await this.redisClient.get(commandOptions({ returnBuffers: true }), MEDIA_CHUNK_REDIS_KEY);
      if (!chunks_buffer) {
        console.log(`No more keys, breaking...`);
        break;
      }
      /*
        In a microservice architecture, we would write to an AWS bucket or some other shared location
      */
      fileStream.write(chunks_buffer);
      this.redisClient.del(MEDIA_CHUNK_REDIS_KEY).then(() => {
        console.log(`Deleted redis key:`, { MEDIA_CHUNK_REDIS_KEY,});
      });
      index = index + 1;
    }

    fileStream.end();
    console.log(`Done aggregating buffers/chunks`, { media_id });

    await MediaObjects.update({ status: UploadStatus.COMPLETED, chunks: data?.chunks ?? null, path: `/storage/media/${media_id}/serve` }, { where: { id: media_id } });
    const MEDIA_OBJECT_REDIS_KEY = `media-${media_id}-object`;
    mediaObject.status = UploadStatus.COMPLETED;
    mediaObject.path = `/storage/media/${media_id}/serve`;
    await this.redisClient.del(MEDIA_OBJECT_REDIS_KEY).then(() => {
      console.log(`Deleted key successfully.`, { MEDIA_OBJECT_REDIS_KEY, media_id });
    });

    /*
      In a microservice architecture, we would, at this point, publish an event that a file was uploaded
    */
    rmqClient.publishEvent({
      exchange: MicroservicesExchanges.STORAGE_EVENTS,
      routingKey: MicroservicesStorageEvents.FILE_COMPLETED,
      data: mediaObject,
      publishOptions: {
        type: MicroservicesStorageEvents.FILE_COMPLETED,
        contentType: ContentTypes.JSON,
      }
    });

    return { media_id, data: mediaObject, results: `file saved` };
  }

  async getMediaFile(media_id: number) {
    const mediaObject = await this.getMediaObject(media_id);
    const fileName = `${mediaObject.key}.${mediaObject.extension}`;
    const filePath = join(process.env['SHARED_STORAGE_VOL_PATH'] || __dirname, fileName);
    const file = createReadStream(filePath);
    return {
      file: new StreamableFile(file),
      type: mediaObject.type,
      name: fileName,
      path: filePath,
    }
  }

}
