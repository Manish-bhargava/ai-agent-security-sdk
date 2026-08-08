import { RuntimeEvent } from "../core/types";
import { RuntimeGuardTransportError } from "../core/errors";

export interface HttpTransportConfig {
  endpoint: string;
  apiKey?: string;
}

export class HttpTransport {
  constructor(
    private readonly config: HttpTransportConfig
  ) {}

  async send(events: RuntimeEvent[]): Promise<void> {
    if (events.length === 0) {
      return;
    }

    try {
      const response = await fetch(this.config.endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",

          ...(this.config.apiKey
            ? {
                authorization: `Bearer ${this.config.apiKey}`,
              }
            : {}),
        },
        body: JSON.stringify({
          events,
        }),
      });

      if (!response.ok) {
        throw new RuntimeGuardTransportError(
          `RuntimeGuard server returned ${response.status}`,
          response.status
        );
      }
    } catch (error) {
      if (error instanceof RuntimeGuardTransportError) {
        throw error;
      }

      throw new RuntimeGuardTransportError(
        `Failed to send events: ${
          error instanceof Error
            ? error.message
            : "Unknown error"
        }`
      );
    }
  }
}