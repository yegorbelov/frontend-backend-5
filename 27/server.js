import express from 'express';
import { randomUUID } from 'node:crypto';
import amqplib from 'amqplib';
import {
  AMQP_URL,
  TASK_QUEUE,
  DLX_EXCHANGE,
  DL_ROUTING_KEY,
  PORT,
} from './config.js';

const app = express();
app.use(express.json());

let channel;

async function connectRabbit() {
  const connection = await amqplib.connect(AMQP_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(TASK_QUEUE, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': DLX_EXCHANGE,
      'x-dead-letter-routing-key': DL_ROUTING_KEY,
    },
  });
}

async function publishTask(task) {
  const body = Buffer.from(JSON.stringify(task));
  channel.sendToQueue(TASK_QUEUE, body, { persistent: true });
}

app.post('/tasks', async (req, res) => {
  const { type, payload } = req.body;

  if (!type || payload === undefined) {
    return res.status(400).json({
      error: 'Fields type and payload are required',
      example: { type: 'email', payload: { to: 'user@example.com' } },
    });
  }

  const task = {
    id: randomUUID(),
    type,
    payload,
    createdAt: new Date().toISOString(),
  };

  try {
    await publishTask(task);
    console.log(`[Producer] Task ${task.id} (${task.type}) added to queue`);
    res.status(202).json({ message: 'Task accepted for processing', task });
  } catch (err) {
    console.error('[Producer] Publication error:', err.message);
    res.status(503).json({ error: 'Failed to send task to queue' });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

await connectRabbit();

app.listen(PORT, () => {
  console.log(`[Producer] API: http://localhost:${PORT}`);
  console.log(`[Producer] POST http://localhost:${PORT}/tasks`);
});
