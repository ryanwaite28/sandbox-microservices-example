import {
  MicroservicesExchanges,
  MicroservicesStorageEvents,
} from "@app/lib-backend";
import {
  MediaInfo,
  MediaObject,
  StorageVersions,
  UploadStatus
} from "@app/lib-shared";
import { writeFileSync, createWriteStream, readdirSync } from "fs";
import { join } from "path";
import { commandOptions } from "redis";
import { ContentTypes, RmqEventMessage } from "rxjs-rabbitmq";
import { MediaObjects } from "./app.models";
import { redisConnection } from "./redis.client";





/* Helpers */

async function getMediaObject(media_id: number, addToCache: boolean = false): Promise<MediaObject> {
  const redisClient = await redisConnection;

  const MEDIA_OBJECT_REDIS_KEY = `media-${media_id}-object`;
  let mediaObject = await redisClient.get(MEDIA_OBJECT_REDIS_KEY);
  if (mediaObject) {
    return JSON.parse(mediaObject) as MediaObject;
  }

  mediaObject = await MediaObjects.findByPk(media_id);
  if (!mediaObject) {
    return null;
  }

  if (addToCache) {
    await redisClient.set(MEDIA_OBJECT_REDIS_KEY, JSON.stringify(mediaObject), { EX: 60 * 60 }).then(() => {
      console.log(`Set media object in cache successfully.`, { MEDIA_OBJECT_REDIS_KEY, media_id });
    });
  }

  
  return (mediaObject as any) as MediaObject;
}




/* Handlers */

export async function MEDIA_START(rmqMessage: RmqEventMessage) {
  const redisClient = await redisConnection;
  const mediaInfo: MediaInfo = rmqMessage.data;

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

  const media_id: number = mediaObject.id;
  
  const MEDIA_OBJECT_REDIS_KEY = `media-${media_id}-object`;
  await redisClient.set(MEDIA_OBJECT_REDIS_KEY, JSON.stringify(mediaObject), { EX: 60 * 60 }).then(() => {
    console.log(`Set key successfully.`, { MEDIA_OBJECT_REDIS_KEY, media_id });
  });
  console.log(`started new media upload: ${media_id}`);

  /*
    In a microservice architecture, we would, at this point, publish an event that a file upload was started
  */
  rmqMessage.publishEvent({
    exchange: MicroservicesExchanges.STORAGE_EVENTS,
    routingKey: MicroservicesStorageEvents.MEDIA_STARTED, // this is the event that a listener can bind a queue to this exchange with
    data: mediaObject,
    publishOptions: {
      type: MicroservicesStorageEvents.MEDIA_STARTED,
      contentType: ContentTypes.JSON
    }
  });

  if (!!rmqMessage.message.properties.replyTo) {
    console.log(`Sending reply ---`);
    rmqMessage.sendMessage({
      queue: rmqMessage.message.properties.replyTo,
      data: mediaObject,
      publishOptions: {
        type: MicroservicesStorageEvents.MEDIA_STARTED,
        contentType: ContentTypes.JSON,
        correlationId: rmqMessage.message.properties.correlationId
      }
    });
  }

  return rmqMessage.ack();
}



export async function MEDIA_PROGRESS(rmqMessage: RmqEventMessage) {
  const redisClient = await redisConnection;

  const media_id: number = rmqMessage.data.id;
  const index: number = rmqMessage.data.index;
  const chunks: number[] = rmqMessage.data.chunks;

  const mediaObject = await getMediaObject(media_id);
  
  if (mediaObject.status === UploadStatus.STARTED) {
    // updating status
    await MediaObjects.update({ status: UploadStatus.PROGRESS }, { where: { id: media_id } });
    const MEDIA_OBJECT_REDIS_KEY = `media-${media_id}-object`;
    mediaObject.status = UploadStatus.PROGRESS;
    await redisClient.set(MEDIA_OBJECT_REDIS_KEY, JSON.stringify(mediaObject), { EX: 60 * 60 }).then(() => {
      console.log(`Set key successfully.`, { MEDIA_OBJECT_REDIS_KEY, media_id });
    });
    /*
      In a microservice architecture, we would, at this point, publish an event that a file was added to
    */
    rmqMessage.publishEvent({
      exchange: MicroservicesExchanges.STORAGE_EVENTS,
      routingKey: MicroservicesStorageEvents.MEDIA_PROGRESS,
      data: mediaObject,
      publishOptions: {
        type: MicroservicesStorageEvents.MEDIA_PROGRESS,
        contentType: ContentTypes.JSON
      }
    });

    if (!!rmqMessage.message.properties.replyTo) {
      console.log(`Sending reply ---`);
      rmqMessage.sendMessage({
        queue: rmqMessage.message.properties.replyTo,
        data: mediaObject,
        publishOptions: {
          type: MicroservicesStorageEvents.MEDIA_PROGRESS,
          contentType: ContentTypes.JSON,
          correlationId: rmqMessage.message.properties.correlationId
        }
      });
    }
  }
  
  const MEDIA_CHUNK_REDIS_KEY: string = `media-${media_id}-chunk-${index}`;
  await redisClient.set(MEDIA_CHUNK_REDIS_KEY, Buffer.from(chunks), { EX: 60 * 60 * 24 }).then(() => {
    console.log(`Set key successfully.`, { MEDIA_CHUNK_REDIS_KEY, media_id, index });
  });

  return rmqMessage.ack();
}

export async function MEDIA_COMPLETE(rmqMessage: RmqEventMessage) {
  const redisClient = await redisConnection;

  const media_id: number = rmqMessage.data.id;
  const chunks: number = rmqMessage.data.chunks || null;

  // check if aggregation is in progress to prevent other app instances from operating on the same task
  const MEDIA_AGG_IN_PROGRESS_KEY = `media-${media_id}-aggregating`;
  const check_aggregating = await redisClient.get(MEDIA_AGG_IN_PROGRESS_KEY);
  if (check_aggregating) {
    console.log(`Aggregating being done by another instance; returning...`);
    return;
  }
  else {
    await redisClient.set(MEDIA_AGG_IN_PROGRESS_KEY, 'YES').then(() => {
      console.log(`Currently handling aggregating in this app instance`, { media_id });
    });
  }

  const mediaObject = await getMediaObject(media_id);

  const fileName = `${mediaObject.key}.${mediaObject.extension}`;
  const urlPath = `/storage/media/${media_id}/serve`;
  const filePath = join(process.env['SHARED_STORAGE_VOL_PATH'] || __dirname, fileName);

  writeFileSync(filePath, '');
  const fileStream = createWriteStream(filePath, {});

  console.log(`Aggregating chunks via write stream`, { media_id });
  let index = 0;
  while (true) {
    const MEDIA_CHUNK_REDIS_KEY: string = `media-${media_id}-chunk-${index}`;
    const chunks_buffer: Buffer = await redisClient.get(commandOptions({ returnBuffers: true }), MEDIA_CHUNK_REDIS_KEY);
    if (!chunks_buffer) {
      console.log(`No more redis chunk keys, breaking...`, { media_id });
      break;
    }
    /*
      In a microservice architecture, we would write to an AWS bucket or some other shared location
    */
    fileStream.write(chunks_buffer);
    redisClient.del(MEDIA_CHUNK_REDIS_KEY).then(() => {
      console.log(`Deleted redis key:`, { MEDIA_CHUNK_REDIS_KEY,});
    });
    index = index + 1;
  }

  fileStream.end();
  console.log(`Done aggregating buffers/chunks`, { media_id });
  const dirContents = readdirSync(process.env['SHARED_STORAGE_VOL_PATH']);
  console.log({ dirContents });

  await MediaObjects.update({ status: UploadStatus.COMPLETED, chunks, path: urlPath }, { where: { id: media_id } });
  const MEDIA_OBJECT_REDIS_KEY = `media-${media_id}-object`;
  mediaObject.status = UploadStatus.COMPLETED;
  mediaObject.path = urlPath;
  redisClient.del(MEDIA_OBJECT_REDIS_KEY).then(() => {
    console.log(`Deleted key successfully.`, { MEDIA_OBJECT_REDIS_KEY, media_id });
  });
  redisClient.del(MEDIA_AGG_IN_PROGRESS_KEY).then(() => {
    console.log(`Deleted key successfully.`, { MEDIA_AGG_IN_PROGRESS_KEY, media_id });
  });

  /*
    In a microservice architecture, we would, at this point, publish an event that a file was uploaded
  */
  rmqMessage.publishEvent({
    exchange: MicroservicesExchanges.STORAGE_EVENTS,
    routingKey: MicroservicesStorageEvents.MEDIA_COMPLETED,
    data: mediaObject,
    publishOptions: {
      type: MicroservicesStorageEvents.MEDIA_COMPLETED,
      contentType: ContentTypes.JSON,
    }
  });

  if (!!rmqMessage.message.properties.replyTo) {
    console.log(`Sending reply ---`);
    rmqMessage.sendMessage({
      queue: rmqMessage.message.properties.replyTo,
      data: mediaObject,
      publishOptions: {
        type: MicroservicesStorageEvents.MEDIA_COMPLETED,
        contentType: ContentTypes.JSON,
        correlationId: rmqMessage.message.properties.correlationId
      }
    });
  }

  return rmqMessage.ack();
}

export async function MEDIA_GET_ALL(rmqMessage: RmqEventMessage) {
  const mediaObjects = await MediaObjects.findAll();
  
  rmqMessage.publishEvent({
    exchange: MicroservicesExchanges.STORAGE_EVENTS,
    routingKey: MicroservicesStorageEvents.MEDIA_FETCHED_BY_ID,
    data: mediaObjects,
    publishOptions: {
      type: MicroservicesStorageEvents.MEDIA_COMPLETED,
      contentType: ContentTypes.JSON,
    }
  });

  if (!!rmqMessage.message.properties.replyTo) {
    console.log(`Sending reply ---`);
    rmqMessage.sendMessage({
      queue: rmqMessage.message.properties.replyTo,
      data: mediaObjects,
      publishOptions: {
        type: MicroservicesStorageEvents.MEDIA_FETCHED_BY_ID,
        contentType: ContentTypes.JSON,
        correlationId: rmqMessage.message.properties.correlationId
      }
    });
  }
  
  return rmqMessage.ack();
}

export async function MEDIA_GET_BY_ID(rmqMessage: RmqEventMessage) {
  const media_id: number = rmqMessage.data.id;
  const mediaObject = await MediaObjects.findByPk(media_id);
  
  rmqMessage.publishEvent({
    exchange: MicroservicesExchanges.STORAGE_EVENTS,
    routingKey: MicroservicesStorageEvents.MEDIA_FETCHED_BY_ID,
    data: mediaObject,
    publishOptions: {
      type: MicroservicesStorageEvents.MEDIA_COMPLETED,
      contentType: ContentTypes.JSON,
    }
  });

  if (!!rmqMessage.message.properties.replyTo) {
    console.log(`Sending reply ---`);
    rmqMessage.sendMessage({
      queue: rmqMessage.message.properties.replyTo,
      data: mediaObject,
      publishOptions: {
        type: MicroservicesStorageEvents.MEDIA_FETCHED_BY_ID,
        contentType: ContentTypes.JSON,
        correlationId: rmqMessage.message.properties.correlationId
      }
    });
  }

  return rmqMessage.ack();
}