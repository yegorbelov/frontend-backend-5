import amqplib from 'amqplib';
import { AMQP_URL, DLQ } from './config.js';

async function watchDlq() {
  const connection = await amqplib.connect(AMQP_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(DLQ, { durable: true });

  console.log(`[DLQ] Watching messages in "${DLQ}" (Ctrl+C to exit)...`);

  channel.consume(DLQ, (msg) => {
    if (!msg) return;
    const task = JSON.parse(msg.content.toString());
    console.log('[DLQ] Unprocessed task:', task);
    channel.ack(msg);
  });
}

await watchDlq();
