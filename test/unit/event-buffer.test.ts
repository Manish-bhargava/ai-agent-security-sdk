import { describe, expect, it } from "vitest";
import { EventBuffer } from "../../src/pipeline/event-buffer";
import { HttpEvent } from "../../src/core/types";

const event: HttpEvent = {
  type: "http",
  method: "GET",
  path: "/users",
  statusCode: 200,
  latency: 10,
  timestamp: new Date().toISOString(),
  headers: {}
};

describe("EventBuffer", () => {
  it("adds events", () => {
    const buffer = new EventBuffer(100);

    buffer.add(event);

    expect(buffer.size()).toBe(1);
  });

  it("does not exceed maximum size", () => {
    const buffer = new EventBuffer(2);

    expect(buffer.add(event)).toBe(true);
    expect(buffer.add(event)).toBe(true);
    expect(buffer.add(event)).toBe(false);

    expect(buffer.size()).toBe(2);
  });

  it("removes events", () => {
    const buffer = new EventBuffer(100);

    buffer.add(event);
    buffer.add(event);

    const removed = buffer.remove(1);

    expect(removed).toHaveLength(1);
    expect(buffer.size()).toBe(1);
  });

  it("clears all events", () => {
    const buffer = new EventBuffer(100);

    buffer.add(event);
    buffer.add(event);

    buffer.clear();

    expect(buffer.size()).toBe(0);
  });
});