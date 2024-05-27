import {
  RabbitMQClient,
} from "rxjs-rabbitmq";
import {
  MEDIA_GET_BY_ID_QUEUE,
  MEDIA_GET_ALL_QUEUE,
  MEDIA_START_QUEUE,
  MEDIA_PROGRESS_QUEUE,
} from "@app/lib-backend";
import { Provider } from "@nestjs/common";



export const rmqClient = new RabbitMQClient({
  connection_url: process.env['RABBITMQ_URL'],
  delayStart: 5000,
  prefetch: 1,
  retryAttempts: 3,
  retryDelay: 3000,
  stopAutoInit: true,

  queues: [
    MEDIA_GET_BY_ID_QUEUE,
    MEDIA_GET_ALL_QUEUE,
    MEDIA_START_QUEUE,
    MEDIA_PROGRESS_QUEUE,
  ],
  exchanges: [],
  bindings: [],

  pre_init_promises: []
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