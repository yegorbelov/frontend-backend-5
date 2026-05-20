export async function processWithRetry(message, processor, options = {}) {
  const { maxRetries = 3, baseDelayMs = 1000, maxDelayMs = 30000 } = options;

  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      await processor(message);
      if (attempt > 0) {
        console.log(
          `[Retry] Successfully processed in ${attempt + 1} attempt(s)`,
        );
      }
      return;
    } catch (err) {
      attempt++;

      if (attempt > maxRetries) {
        console.error(
          `[Retry] All ${maxRetries} attempts failed. Message sent to DLQ.`,
        );
        throw err;
      }

      const exponentialDelay = Math.min(
        baseDelayMs * 2 ** (attempt - 1),
        maxDelayMs,
      );
      const jitter = Math.random() * 1000;
      const delay = exponentialDelay + jitter;

      console.warn(
        `[Retry] Attempt ${attempt}/${maxRetries} failed: ${err.message}. Retrying in ${Math.round(delay)}ms`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
