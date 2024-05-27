import {
  RabbitMQClient,
} from "rxjs-rabbitmq";
import {
  MicroservicesQueues,

  MEDIA_GET_BY_ID_QUEUE,
  MEDIA_GET_ALL_QUEUE,
  MEDIA_START_QUEUE,
  MEDIA_PROGRESS_QUEUE,

  STORAGE_EXCHANGE,
} from "@app/lib-backend";
import { firstValueFrom } from "rxjs";
import { onDatabaseReady } from "./app.models";
import * as RmqMessageHandlers from "./rmq.handler";



const rmqClient = new RabbitMQClient({
  connection_url: process.env['RABBITMQ_URL'],
  delayStart: 5000,
  prefetch: 1,
  retryAttempts: 3,
  retryDelay: 3000,
  stopAutoInit: false,

  queues: [
    // receive storage requests
    MEDIA_GET_BY_ID_QUEUE,
    MEDIA_GET_ALL_QUEUE,
    MEDIA_START_QUEUE,
    MEDIA_PROGRESS_QUEUE,
  ],
  exchanges: [
    // notify clients of storage events
    STORAGE_EXCHANGE,
  ],
  bindings: [],

  pre_init_promises: [
    firstValueFrom(onDatabaseReady())
  ]
});


rmqClient.onQueue(MicroservicesQueues.Storage.MEDIA_START).handleAll(RmqMessageHandlers.MEDIA_START);
rmqClient.onQueue(MicroservicesQueues.Storage.MEDIA_PROGRESS).handleAll(RmqMessageHandlers.MEDIA_PROGRESS);
rmqClient.onQueue(MicroservicesQueues.Storage.MEDIA_GET_BY_ID).handleAll(RmqMessageHandlers.MEDIA_GET_BY_ID);
rmqClient.onQueue(MicroservicesQueues.Storage.MEDIA_GET_ALL).handleAll(RmqMessageHandlers.MEDIA_GET_ALL);
