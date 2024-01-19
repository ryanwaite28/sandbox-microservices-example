import { createClient } from 'redis';



export const redisConnection = createClient({
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
