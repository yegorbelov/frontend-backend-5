export const AMQP_URL = process.env.AMQP_URL ?? 'amqp://localhost';
export const TASK_QUEUE = 'task_queue';
export const DLX_EXCHANGE = 'dlx_exchange';
export const DLQ = 'dead_letter_queue';
export const DL_ROUTING_KEY = 'dead';
export const PORT = Number(process.env.PORT) || 3027;
