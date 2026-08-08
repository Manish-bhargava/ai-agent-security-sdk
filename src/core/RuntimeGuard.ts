import {
  RuntimeGuardConfig
} from "./types";

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
  private readonly silent: boolean;

  private flushTimer?: NodeJS.Timeout;
  private flushing = false;
  private shutdownStarted = false;

  constructor(
    config: RuntimeGuardConfig = {}
  ) {
    this.batchSize = config.batchSize ?? 50;

    this.flushInterval =
      config.flushInterval ?? 5000;

    const maxBufferSize =
      config.maxBufferSize ?? 1000;

    this.silent = config.silent ?? false;

    this.buffer = new EventBuffer(
      maxBufferSize
    );

    this.batcher = new Batcher(
      this.buffer,
      this.batchSize
    );

    this.transport = new HttpTransport(
      config.endpoint,
      config.apiKey,
      config.requestTimeout ?? 5000,
      config.maxRetries ?? 3,
      config.retryDelay ?? 500
    );

    this.startAutoFlush();
  }

  middleware() {
    return createHttpMiddleware(
      this.buffer,
      () => {
        if (
          this.buffer.size() >=
          this.batchSize
        ) {
          void this.flush();
        }
      }
    );
  }

  async flush(): Promise<void> {
    if (
      this.flushing ||
      this.shutdownStarted
    ) {
      return;
    }

    if (this.buffer.size() === 0) {
      return;
    }

    this.flushing = true;

    try {
      const batch =
        this.batcher.createBatch();

      if (batch.length === 0) {
        return;
      }

      try {
        await this.transport.send(batch);
      } catch (error) {
        // Put events back at the front logically.
        // We don't throw into the customer's application.
        for (const event of batch.reverse()) {
          this.buffer.prepend(event);
        }

        this.logError(
          "Failed to send events",
          error
        );
      }
    } finally {
      this.flushing = false;
    }
  }

  async shutdown(): Promise<void> {
    if (this.shutdownStarted) {
      return;
    }

    this.shutdownStarted = true;

    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    if (this.buffer.size() > 0) {
      const batch = this.buffer.getAll();

      this.buffer.clear();

      try {
        await this.transport.send(batch);
      } catch (error) {
        this.logError(
          "Failed to flush during shutdown",
          error
        );
      }
    }
  }

  getBufferSize(): number {
    return this.buffer.size();
  }

  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      void this.flush();
    }, this.flushInterval);

    this.flushTimer.unref?.();
  }

  private logError(
    message: string,
    error: unknown
  ): void {
    if (this.silent) {
      return;
    }

    console.error(
      `[RuntimeGuard] ${message}:`,
      error
    );
  }
}