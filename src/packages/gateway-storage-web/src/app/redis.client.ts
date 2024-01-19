import { Provider } from '@nestjs/common';
import { createClient } from 'redis';


export const REDIS_DI_TOKEN: string = `REDIS_DI_PROVIDER-${Date.now()}`;

export const REDIS_DI_PROVIDER: Provider = {
  provide: REDIS_DI_TOKEN,
  useFactory: async () => {
    console.log(`Connecting to Redis...`);
    const client = await createClient({
      // url: process.env['REDIS_URL'],
      // url: `redis://0.0.0.0:6378`
      url: process.env['REDIS_URL']
    })
    .on('error', (err) => {
      console.log('Redis Client Error', err);
    })
    .on('connect', () => {
      console.log(`Redis connect attempt...`);
    })
    .on('ready', () => {
      console.log('Redis Client Connected!');
    })
    .connect();
    return client;
  }
};
