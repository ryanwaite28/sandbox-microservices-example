import { RabbitMQClient, RmqEventMessage } from 'rxjs-rabbitmq';
import {
  STORAGE_EXCHANGE,
  LOGGING_QUEUE,
  LOGGER,
  USERS_EXCHANGE,
  BLOG_EXCHANGE,
} from '@app/lib-backend';
import { MongoClient } from 'mongodb';

class MongodbManager {
  private static _client: MongoClient;

  public static get client(): MongoClient {
    return this._client;
  }

  public static async init() {
    if (this._client) {
      return this._client;
    }

    const uri = process.env['DATABASE_URL'];
    if (!uri) {
      console.error('DATABASE_URL is not set!');
      throw new Error('DATABASE_URL is not set!');
    }

    try {
      const mongoClient = new MongoClient(uri);
      console.log('Connecting to MongoDB Atlas cluster...');
      await mongoClient.connect();
      console.log('================ Successfully connected to MongoDB Atlas! ================');
      this._client = mongoClient;
    } catch (error) {
      console.error('Connection to MongoDB Atlas failed!', error);
      throw error;
    }
  }

  public static async close() {
    await this._client.close();
  }
}

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
    {
      exchange: STORAGE_EXCHANGE.name,
      queue: LOGGING_QUEUE.name,
      routingKey: '#',
    },
    {
      exchange: USERS_EXCHANGE.name,
      queue: LOGGING_QUEUE.name,
      routingKey: '#',
    },
    {
      exchange: BLOG_EXCHANGE.name,
      queue: LOGGING_QUEUE.name,
      routingKey: '#',
    },
  ],

  pre_init_promises: [
    MongodbManager.init(),
  ],
});

const LogEvent = (rmqMessage: RmqEventMessage) => {
  const logData = {
    timestamp: new Date().toISOString(),
    data: rmqMessage.data,
    rmqMessage: {
      fields: rmqMessage.message.fields,
      properties: rmqMessage.message.properties,
    },
  };
  LOGGER.info(`Log Event`, logData);
  MongodbManager.client.db('logs_db').collection('log_events').insertOne(logData)
    .then(() => {
      console.log(`Successfully logged event into MongoDB`, logData);
    })
    .catch((error) => {
      console.error(`Failed to log event`, logData, error);
    });
  rmqMessage.ack();
};

rmqClient.onQueue(LOGGING_QUEUE.name).handleAll(LogEvent);
