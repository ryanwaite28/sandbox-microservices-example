import {
  RabbitMQClient,
  RmqEventMessage,
} from "rxjs-rabbitmq";
import {
  STORAGE_EXCHANGE,
  LOGGING_QUEUE,
  LOGGER,
  USERS_EXCHANGE,
  BLOG_EXCHANGE,
} from "@app/lib-backend";



const rmqClient = new RabbitMQClient({
  connection_url: process.env['RABBITMQ_URL'],
  delayStart: 5000,
  prefetch: 1,
  retryAttempts: 3,
  retryDelay: 3000,
  stopAutoInit: false,

  queues: [
    // receive storage requests
    LOGGING_QUEUE,
  ],
  exchanges: [
    // notify clients of storage events
    STORAGE_EXCHANGE,
    USERS_EXCHANGE,
    BLOG_EXCHANGE,
  ],
  bindings: [
    { exchange: STORAGE_EXCHANGE.name, queue: LOGGING_QUEUE.name, routingKey: '#' },
    { exchange: USERS_EXCHANGE.name, queue: LOGGING_QUEUE.name, routingKey: '#' },
    { exchange: BLOG_EXCHANGE.name, queue: LOGGING_QUEUE.name, routingKey: '#' },
  ],

  pre_init_promises: []
});

const LogEvent = (rmqMessage: RmqEventMessage) => {
  LOGGER.info(`Log Event`, {
    data: rmqMessage.data,
    rmqMessage: {
      fields: rmqMessage.message.fields,
      properties: rmqMessage.message.properties,
    }
  });
  rmqMessage.ack();
};

rmqClient.onQueue(LOGGING_QUEUE.name).handleAll(LogEvent);
