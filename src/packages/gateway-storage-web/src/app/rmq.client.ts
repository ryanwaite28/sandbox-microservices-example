import { firstValueFrom } from "rxjs";
import {
  RabbitMQClient,
  RmqEventMessage,
} from "rxjs-rabbitmq";
import { MediaObjects, onDatabaseReady } from "./app.models";
import {
  MicroservicesQueues,
  MicroservicesStorageRequests,
  STORAGE_EVENTS_EXCHANGE
} from "@app/lib-backend";
import { Provider } from "@nestjs/common";
import { MediaObject } from "@app/lib-shared";




export const rmqClient = new RabbitMQClient({
  connection_url: process.env['RABBITMQ_URL'],
  delayStart: 5000,
  prefetch: 1,
  retryAttempts: 3,
  retryDelay: 3000,
  stopAutoInit: true,

  queues: [
    { name: MicroservicesQueues.STORAGE_GATEWAY, handleMessageTypes: [], options: { durable: true } }
  ],
  exchanges: [
    // notify clients of storage events
    STORAGE_EVENTS_EXCHANGE,
  ],
  bindings: [],

  pre_init_promises: [
    firstValueFrom(onDatabaseReady()),
  ]
});

rmqClient.onQueue(MicroservicesQueues.STORAGE_GATEWAY).handleAll(async (event: RmqEventMessage) => {
  console.log(`-------- Received message on queue: ${MicroservicesQueues.STORAGE_GATEWAY}`, event);

  switch (event.message.properties.type) {
    case MicroservicesStorageRequests.GET_MEDIAOBJECT_ALL: {
      const mediaObjects: MediaObject[] = await MediaObjects.findAll();
      const response = {
        queue: event.message.properties.replyTo,
        data: mediaObjects || null,
        publishOptions: {
          ...event.message.properties,
          correlationId: event.message.properties.correlationId,
          replyTo: event.message.properties.replyTo,
        }
      };
      console.log(`----- Replying with:`, response);
      rmqClient.sendMessage(response);
      break;
    }

    case MicroservicesStorageRequests.GET_MEDIAOBJECT_BY_ID: {
      const mediaObject: MediaObject = await MediaObjects.findByPk(event.data.id);
      const response = {
        queue: event.message.properties.replyTo,
        data: mediaObject || null,
        publishOptions: {
          ...event.message.properties,
          correlationId: event.message.properties.correlationId,
          replyTo: event.message.properties.replyTo,
        }
      };
      console.log(`----- Replying with:`, response);
      rmqClient.sendMessage(response);
      break;
    }

    default: {
      console.log(`Message was not handled...`);
    }
  }

  event.ack();
});




export const RMQ_PROVIDER_TOKEN: string = `RMQ_PROVIDER-${Date.now()}`;

export const RMQ_PROVIDER: Provider = {
  provide: RMQ_PROVIDER_TOKEN, // the token is not needed because nothing will be injected
  useFactory: async () => {
    // the importing thing is connecting to the database before the app is ready
    await rmqClient.init();
    return rmqClient;
  }
}