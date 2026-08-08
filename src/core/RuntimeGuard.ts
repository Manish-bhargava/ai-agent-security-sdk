import { RuntimeGuardConfig } from "./config";
import { RuntimeEvent } from "./types";
import { EventBuffer } from "../pipeline/event-buffer";
import { HttpTransport } from "../transport/http.transport";
import { sanitizeHeaders } from "../security/sanitizer";
import { installConsoleHook } from "../collectors/console.hook";
import { httpMiddleware } from "../middleware/http.middleware";
export class RuntimeGuard {
  private readonly buffer: EventBuffer;
  private readonly transport: HttpTransport;

  private flushTimer?: NodeJS.Timeout;
  private stopConsoleHook?: () => void;

  private readonly batchSize: number;
  private readonly flushInterval: number;

  constructor(config: RuntimeGuardConfig) {
    this.buffer = new EventBuffer(
      config.bufferSize ?? 1000
    );

    this.batchSize = config.batchSize ?? 20;
    this.flushInterval = config.flushInterval ?? 5000;

    this.transport = new HttpTransport({
      endpoint: config.endpoint,
      apiKey: config.apiKey,
    });

    this.start();
  }

  
  private start(): void {
    this.stopConsoleHook = installConsoleHook(
      (event) => {
        this.capture(event);
      }
    );

    this.flushTimer = setInterval(() => {
      void this.flush();
    }, this.flushInterval);
  }

  middleware() {
  return httpMiddleware(this);
}
  capture(event: RuntimeEvent): void {
    const sanitizedEvent = this.sanitize(event);

    this.buffer.add(sanitizedEvent);

    if (this.buffer.size() >= this.batchSize) {
      void this.flush();
    }
  }

  private sanitize(event: RuntimeEvent): RuntimeEvent {
    if (event.type === "http") {
      return {
        ...event,
        headers: sanitizeHeaders(event.headers),
      };
    }

    return event;
  }

  async flush(): Promise<void> {
    if (this.buffer.size() === 0) {
      return;
    }

    const events = this.buffer.remove(this.batchSize);

    if (events.length === 0) {
      return;
    }

    try {
      await this.transport.send(events);
    } catch (error) {
      console.error(
        "[RuntimeGuard] Failed to send events:",
        error
      );
    }
  }

  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.stopConsoleHook?.();

    await this.flush();
  }
}