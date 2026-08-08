import express from "express";
import { RuntimeGuard } from "../../src/index.js";

const app = express();

const guard = new RuntimeGuard({
  batchSize: 3,
  flushInterval: 5000,
  maxBufferSize: 1000
});

app.use(guard.middleware());

app.get("/users", (_req, res) => {
  res.json({
    users: ["Manish", "Rahul"]
  });
});

app.get("/products", (_req, res) => {
  res.json({
    products: ["Laptop", "Phone"]
  });
});

const server = app.listen(3000, () => {
  console.log("Server running on port 3000");
});

const shutdown = async () => {
  await guard.shutdown();

  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);