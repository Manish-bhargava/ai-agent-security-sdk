import { RuntimeGuardConfig } from "./types";
import { EventBuffer } from "../pipeline/event-buffer";
import { Batcher } from "../pipeline/batcher";
import { HttpTransport } from "../transport/http.transport";
import { createHttpMiddleware } from "../middleware/http.middleware";

export class RuntimeGuard {
  private readonly buffer: EventBuffer;
  private readonly batcher: Batcher;
  private readonly transport: HttpTransport;

  private readonly batchSize: number;
  private readonly flushInterval: number;

  private flushTimer?: NodeJS.Timeout;
  private flushing = false;

  constructor(config: RuntimeGuardConfig = {}) {
    this.batchSize = config.batchSize ?? 10;
    this.flushInterval = config.flushInterval ?? 5000;

    this.buffer = new EventBuffer();

    this.batcher = new Batcher(
      this.buffer,
      this.batchSize
    );

    this.transport = new HttpTransport(
      config.endpoint,
      config.apiKey
    );

    this.startAutoFlush();
  }

  middleware() {
    return createHttpMiddleware(
      this.buffer,
      () => this.flush()
    );
  }

  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      void this.flush();
    }, this.flushInterval);
  }

  async flush(): Promise<void> {
    if (this.flushing) {
      return;
    }

    if (this.buffer.size() === 0) {
      return;
    }

    this.flushing = true;

    try {
      const batch = this.batcher.createBatch();

      if (batch.length === 0) {
        return;
      }

      await this.transport.send(batch);
    } catch (error) {
      console.error(
        "[RuntimeGuard] Failed to send events:",
        error
      );
    } finally {
      this.flushing = false;
    }
  }

  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    await this.flush();
  }

  getBufferSize(): number {
    return this.buffer.size();
  }
}