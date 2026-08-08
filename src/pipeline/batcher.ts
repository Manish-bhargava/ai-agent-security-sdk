import { RuntimeEvent } from "../core/types";
import { EventBuffer } from "./event-buffer";

export class Batcher {
  constructor(
    private readonly buffer: EventBuffer,
    private readonly batchSize: number
  ) {}

  createBatch(): RuntimeEvent[] {
    return this.buffer.remove(this.batchSize);
  }
}