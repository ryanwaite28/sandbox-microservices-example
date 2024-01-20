import { MicroservicesQueues } from "../enums/queues.enum";

export const STORAGE_REQUESTS_QUEUE = Object.freeze({ name: MicroservicesQueues.STORAGE, options: Object.freeze({ durable: true }) });

export const LOGGING_QUEUE = Object.freeze({ name: MicroservicesQueues.LOGGING, options: Object.freeze({ durable: true }) });