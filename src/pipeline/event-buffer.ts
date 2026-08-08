import { RuntimeEvent } from "../core/types";

export class EventBuffer {
  private events: RuntimeEvent[] = [];

  add(event: RuntimeEvent): void {
    this.events.push(event);
  }

  getAll(): RuntimeEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }

  size(): number {
    return this.events.length;
  }
}