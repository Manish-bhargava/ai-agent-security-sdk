import { RuntimeEvent } from "../core/types";
import { EventBuffer } from "./event-buffer";

export class Batcher {
  constructor(
    private readonly buffer: EventBuffer,
    private readonly batchSize: number
  ) {}

  createBatch(): RuntimeEvent[] {
    if (this.buffer.size() < this.batchSize) {
      return [];
    }

    const events = this.buffer.getAll();

    const batch = events.slice(0, this.batchSize);
    const remaining = events.slice(this.batchSize);

    this.buffer.clear();

    for (const event of remaining) {
      this.buffer.add(event);
    }

    return batch;
  }
}