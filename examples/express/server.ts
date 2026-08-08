import express from "express";
import { RuntimeGuard } from "../../src";

const app = express();

const guard = new RuntimeGuard({
  batchSize: 3,
  flushInterval: 5000
});

app.use(guard.middleware());

app.get("/users", (req, res) => {
  res.json({
    users: ["Manish", "Rahul"]
  });
});

app.get("/products", (req, res) => {
  res.json({
    products: ["Laptop", "Phone"]
  });
});

const server = app.listen(3000, () => {
  console.log("Server running on port 3000");
});

process.on("SIGINT", async () => {
  console.log("[RuntimeGuard] Shutting down...");

  await guard.shutdown();

  server.close(() => {
    process.exit(0);
  });
});