import { MicroservicesExchanges } from "../enums/exchanges.enum";

export const STORAGE_EXCHANGE = Object.freeze({ name: MicroservicesExchanges.STORAGE, type: 'topic', options: Object.freeze({ durable: true }) });