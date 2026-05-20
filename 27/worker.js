import amqplib from 'amqplib';
import {
  AMQP_URL,
  TASK_QUEUE,
  DLX_EXCHANGE,
  DL_ROUTING_KEY,
} from './config.js';
import { processWithRetry } from './retry.js';

const WORKER_ID = process.env.WORKER_ID ?? '1';
const SIMULATE_FAILURE = process.env.SIMULATE_FAILURE === 'true';
const FAILURE_RATE = Number(process.env.FAILURE_RATE ?? '0.3');

async function processTask(task) {
  const delayMs = 1000 + Math.floor(Math.random() * 1000);
  console.log(
    `[Worker ${WORKER_ID}] Processing task ${task.id} (${task.type}), ~${delayMs}ms...`,
  );

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (SIMULATE_FAILURE && Math.random() < FAILURE_RATE) {
    throw new Error('Simulation of processing failure');
  }

  console.log(`[Worker ${WORKER_ID}] Task ${task.id} completed:`, task.payload);
}

async function startWorker() {
  const connection = await amqplib.connect(AMQP_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(TASK_QUEUE, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': DLX_EXCHANGE,
      'x-dead-letter-routing-key': DL_ROUTING_KEY,
    },
  });

  channel.prefetch(1);

  console.log(`[Worker ${WORKER_ID}] Waiting for tasks in "${TASK_QUEUE}"...`);

  channel.consume(TASK_QUEUE, async (msg) => {
    if (!msg) return;

    const task = JSON.parse(msg.content.toString());

    try {
      await processWithRetry(task, processTask, { maxRetries: 3 });
      channel.ack(msg);
    } catch (err) {
      console.error(
        `[Worker ${WORKER_ID}] Task ${task.id} sent to DLQ:`,
        err.message,
      );
      channel.nack(msg, false, false);
    }
  });
}

await startWorker();
