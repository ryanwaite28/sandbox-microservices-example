import { MicroservicesExchanges } from "../enums/exchanges.enum";

export const STORAGE_EXCHANGE = Object.freeze({ name: MicroservicesExchanges.STORAGE, type: 'topic', options: Object.freeze({ durable: true }) });
export const USERS_EXCHANGE = Object.freeze({ name: MicroservicesExchanges.USERS, type: 'topic', options: Object.freeze({ durable: true }) });
export const BLOG_EXCHANGE = Object.freeze({ name: MicroservicesExchanges.BLOG, type: 'topic', options: Object.freeze({ durable: true }) });