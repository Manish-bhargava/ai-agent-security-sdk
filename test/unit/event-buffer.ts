import { EventBuffer } from "../../src/pipeline/event-buffer";

const buffer = new EventBuffer();

const event = {
  type: "http" as const,
  method: "GET",
  path: "/users",
  statusCode: 200,
  latency: 10,
  timestamp: new Date().toISOString(),
  headers: {}
};

buffer.add(event);

console.log("Buffer size:", buffer.size());
console.log("Events:", buffer.getAll());

buffer.clear();

console.log("Buffer size after clear:", buffer.size());