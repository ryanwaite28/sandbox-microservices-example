import {
  RabbitMQClient, RmqEventMessage,
} from "rxjs-rabbitmq";
import { MicroservicesQueues, MicroservicesStorageEvents, STORAGE_EVENTS_EXCHANGE } from "@app/lib-backend";
import { TimeDurations } from "@app/lib-shared";
import {
  readdirSync
} from 'fs';



const rmqClient = new RabbitMQClient({
  connection_url: process.env['RABBITMQ_URL'],
  delayStart: 5000,
  prefetch: 1,
  retryAttempts: 3,
  retryDelay: 3000,
  stopAutoInit: false,

  queues: [
    { name: MicroservicesQueues.STORAGE_MS, handleMessageTypes: [], options: { durable: true } }
  ],
  exchanges: [
    // notify clients of storage events
    STORAGE_EVENTS_EXCHANGE,
  ],
  bindings: [
    { queue: MicroservicesQueues.STORAGE_MS, exchange: STORAGE_EVENTS_EXCHANGE.name, routingKey: '#' }
  ],

  pre_init_promises: [

  ]
});


rmqClient.onQueue(MicroservicesQueues.STORAGE_MS).handleAll(async (event: RmqEventMessage) => {
  console.log(`-------- Received message on queue: ${MicroservicesQueues.STORAGE_MS}`, event);

  switch (event.message.properties.type) {
    case MicroservicesStorageEvents.FILE_STARTED: {
      console.log(`FILE_STARTED event`);
      break;
    }

    case MicroservicesStorageEvents.FILE_PROGRESS: {
      console.log(`FILE_PROGRESS event`);
      break;
    }

    case MicroservicesStorageEvents.FILE_COMPLETED: {
      console.log(`FILE_COMPLETED event`);
      const dirContents = readdirSync(process.env['SHARED_STORAGE_VOL_PATH']);
      console.log({ dirContents });
      break;
    }
  }

  event.ack();
});


// setInterval(() => {
//   console.log(`Keep Alive - Admit One`);
// }, TimeDurations.HOUR);