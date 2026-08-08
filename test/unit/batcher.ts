import { EventBuffer } from "../../src/pipeline/event-buffer";
import { Batcher } from "../../src/pipeline/batcher";

const buffer = new EventBuffer();

for (let i = 1; i <= 5; i++) {
  buffer.add({
    type: "http",
    method: "GET",
    path: `/test-${i}`,
    statusCode: 200,
    latency: 10,
    timestamp: new Date().toISOString(),
    headers: {}
  });
}

console.log("Before batch:", buffer.size());

const batcher = new Batcher(buffer, 3);

const batch = batcher.createBatch();

console.log("Batch:", batch);
console.log("After batch:", buffer.size());