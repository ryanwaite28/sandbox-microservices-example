import { firstValueFrom } from "rxjs";
import {
  RabbitMQClient,
  RmqEventMessage,
} from "rxjs-rabbitmq";
import {
  MicroservicesQueues,
  MicroservicesStorageRequests,
  STORAGE_EXCHANGE
} from "@app/lib-backend";
import { Provider } from "@nestjs/common";
import { MediaObject } from "@app/lib-shared";




export const rmqClient = new RabbitMQClient({
  connection_url: process.env['RABBITMQ_URL'],
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  stopAutoInit: false,

  queues: [],
  exchanges: [],
  bindings: [],

  pre_init_promises: [
  ]
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