import {
  RabbitMQClient,
  RmqEventMessage,
} from "rxjs-rabbitmq";
import {
  MicroservicesQueues,
  MicroservicesStorageRequests,
  STORAGE_REQUESTS_QUEUE,
  STORAGE_EVENTS_EXCHANGE,
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
    STORAGE_REQUESTS_QUEUE,
  ],
  exchanges: [
    // notify clients of storage events
    STORAGE_EVENTS_EXCHANGE,
  ],
  bindings: [],

  pre_init_promises: [
    firstValueFrom(onDatabaseReady())
  ]
});


rmqClient.onQueue(MicroservicesQueues.STORAGE).handleAll(async (rmqMessage: RmqEventMessage) => {
  console.log(`-------- Received message on queue: ${MicroservicesQueues.STORAGE}`, rmqMessage);

  switch (rmqMessage.message.properties.type) {
    case MicroservicesStorageRequests.MEDIA_START: {
      return RmqMessageHandlers.MEDIA_START(rmqMessage);
    }

    case MicroservicesStorageRequests.MEDIA_PROGRESS: {
      return RmqMessageHandlers.MEDIA_PROGRESS(rmqMessage);
    }

    case MicroservicesStorageRequests.MEDIA_COMPLETE: {
      return RmqMessageHandlers.MEDIA_COMPLETE(rmqMessage);
    }



    case MicroservicesStorageRequests.MEDIA_GET_ALL: {
      return RmqMessageHandlers.MEDIA_GET_ALL(rmqMessage);
    }

    case MicroservicesStorageRequests.MEDIA_GET_BY_ID: {
      return RmqMessageHandlers.MEDIA_GET_BY_ID(rmqMessage);
    }
  }
});


// setInterval(() => {
//   console.log(`Keep Alive - Admit One`);
// }, TimeDurations.HOUR);