import { describe, expect, it } from "vitest";
import { EventBuffer } from "../../src/pipeline/event-buffer";
import { Batcher } from "../../src/pipeline/batcher";
import { HttpEvent } from "../../src/core/types";

function createEvent(path: string): HttpEvent {
  return {
    type: "http",
    method: "GET",
    path,
    statusCode: 200,
    latency: 10,
    timestamp: new Date().toISOString(),
    headers: {}
  };
}

describe("Batcher", () => {
  it("creates a batch with the configured size", () => {
    const buffer = new EventBuffer(100);

    buffer.add(createEvent("/1"));
    buffer.add(createEvent("/2"));
    buffer.add(createEvent("/3"));
    buffer.add(createEvent("/4"));
    buffer.add(createEvent("/5"));

    const batcher = new Batcher(buffer, 3);

    const batch = batcher.createBatch();

    expect(batch).toHaveLength(3);
    expect(buffer.size()).toBe(2);
  });

  it("returns remaining events in later batches", () => {
    const buffer = new EventBuffer(100);

    buffer.add(createEvent("/1"));
    buffer.add(createEvent("/2"));
    buffer.add(createEvent("/3"));

    const batcher = new Batcher(buffer, 2);

    const firstBatch = batcher.createBatch();
    const secondBatch = batcher.createBatch();

    expect(firstBatch).toHaveLength(2);
    expect(secondBatch).toHaveLength(1);
    expect(buffer.size()).toBe(0);
  });
});