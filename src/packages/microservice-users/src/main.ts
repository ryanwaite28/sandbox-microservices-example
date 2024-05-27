import {
  RabbitMQClient,
} from "rxjs-rabbitmq";
import {
  MicroservicesQueues,

  USER_GET_BY_ID_QUEUE,
  USERS_GET_LIKE_USERNAME_QUEUE,
  USER_CREATE_QUEUE,
  USER_UPDATE_QUEUE,
  USER_DELETE_QUEUE,

  USERS_EXCHANGE,
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
    USER_GET_BY_ID_QUEUE,
    USERS_GET_LIKE_USERNAME_QUEUE,
    USER_CREATE_QUEUE,
    USER_UPDATE_QUEUE,
    USER_DELETE_QUEUE,
  ],
  exchanges: [
    // notify clients of storage events
    USERS_EXCHANGE,
  ],
  bindings: [],

  pre_init_promises: [
    firstValueFrom(onDatabaseReady())
  ]
});


rmqClient.onQueue(MicroservicesQueues.Users.USER_GET_BY_ID).handleAll(RmqMessageHandlers.USER_GET_BY_ID);
rmqClient.onQueue(MicroservicesQueues.Users.USERS_GET_LIKE_USERNAME).handleAll(RmqMessageHandlers.USERS_GET_LIKE_USERNAME);
rmqClient.onQueue(MicroservicesQueues.Users.USER_CREATE).handleAll(RmqMessageHandlers.USER_CREATE);
rmqClient.onQueue(MicroservicesQueues.Users.USER_UPDATE).handleAll(RmqMessageHandlers.USER_UPDATE);
rmqClient.onQueue(MicroservicesQueues.Users.USER_DELETE).handleAll(RmqMessageHandlers.USER_DELETE);

