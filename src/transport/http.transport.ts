import {
  RuntimeEvent
} from "../core/types";

import {
  RuntimeGuardTransportError
} from "../core/errors";

export class HttpTransport {
  constructor(
    private readonly endpoint?: string,
    private readonly apiKey?: string,
    private readonly timeout = 5000,
    private readonly maxRetries = 3,
    private readonly retryDelay = 500
  ) {}

  async send(events: RuntimeEvent[]): Promise<void> {
    if (events.length === 0) {
      return;
    }

    // Local development mode.
    if (!this.endpoint) {
      console.log("[RuntimeGuard] Transport:", events);
      return;
    }

    let lastError: unknown;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        await this.sendRequest(events);
        return;
      } catch (error) {
        lastError = error;

        if (attempt === this.maxRetries) {
          break;
        }

        await this.sleep(
          this.retryDelay * Math.pow(2, attempt)
        );
      }
    }

    throw lastError;
  }

  private async sendRequest(
    events: RuntimeEvent[]
  ): Promise<void> {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, this.timeout);

    try {
      const response = await fetch(this.endpoint!, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          ...(this.apiKey
            ? {
                Authorization: `Bearer ${this.apiKey}`
              }
            : {})
        },

        body: JSON.stringify({
          events
        }),

        signal: controller.signal
      });

      if (!response.ok) {
        throw new RuntimeGuardTransportError(
          `Transport failed with status ${response.status}`,
          response.status
        );
      }
    } finally {
      clearTimeout(timer);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve =>
      setTimeout(resolve, ms)
    );
  }
}