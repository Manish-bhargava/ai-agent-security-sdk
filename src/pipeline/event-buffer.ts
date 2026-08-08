import { RuntimeEvent } from "../core/types";

export class EventBuffer {
  private events: RuntimeEvent[] = [];

  constructor(private readonly maxSize: number) {}

  add(event: RuntimeEvent): boolean {
    if (this.events.length >= this.maxSize) {
      return false;
    }

    this.events.push(event);

    return true;
  }

  prepend(event: RuntimeEvent): boolean {
    if (this.events.length >= this.maxSize) {
      return false;
    }

    this.events.unshift(event);

    return true;
  }

  getAll(): RuntimeEvent[] {
    return [...this.events];
  }

  remove(count: number): RuntimeEvent[] {
    return this.events.splice(0, count);
  }

  clear(): void {
    this.events = [];
  }

  size(): number {
    return this.events.length;
  }
}