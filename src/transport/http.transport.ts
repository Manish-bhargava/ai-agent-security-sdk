//send events
import { RuntimeEvent } from "../core/types";

export class HttpTransport {
  constructor(
    private readonly endpoint?: string,
    private readonly apiKey?: string
  ) {}

  async send(events: RuntimeEvent[]): Promise<void> {
    if (events.length === 0) {
      return;
    }

    if (!this.endpoint) {
      console.log("[RuntimeGuard] Transport:", events);
      return;
    }

    const response = await fetch(this.endpoint, {
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
      })
    });

    if (!response.ok) {
      throw new Error(
        `RuntimeGuard transport failed: ${response.status}`
      );
    }
  }
}