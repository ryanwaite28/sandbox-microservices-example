import { MicroservicesExchanges } from "../enums/exchanges.enum";

export const STORAGE_EVENTS_EXCHANGE = Object.freeze({ name: MicroservicesExchanges.STORAGE_EVENTS, type: 'topic', options: Object.freeze({ durable: true }) });