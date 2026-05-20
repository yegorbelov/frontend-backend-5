import amqplib from 'amqplib';
import {
  AMQP_URL,
  TASK_QUEUE,
  DLX_EXCHANGE,
  DLQ,
  DL_ROUTING_KEY,
} from './config.js';

async function setupQueues() {
  const connection = await amqplib.connect(AMQP_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(DLX_EXCHANGE, 'direct', { durable: true });
  await channel.assertQueue(DLQ, { durable: true });
  await channel.bindQueue(DLQ, DLX_EXCHANGE, DL_ROUTING_KEY);

  await channel.assertQueue(TASK_QUEUE, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': DLX_EXCHANGE,
      'x-dead-letter-routing-key': DL_ROUTING_KEY,
    },
  });

  console.log(`Queues configured: ${TASK_QUEUE} → [DLX] → ${DLQ}`);
  await connection.close();
}

await setupQueues();
