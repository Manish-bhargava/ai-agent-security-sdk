import express from "express";
import { RuntimeGuard } from "../../src";

const app = express();

const guard = new RuntimeGuard({
  endpoint: "http://localhost:4000/events",
  batchSize: 3,
  flushInterval: 5000,
});

app.use(guard.middleware());

app.get("/users", (_req, res) => {
  console.log("Fetching users");

  res.json({
    users: ["Manish", "Rahul"],
  });
});

app.get("/products", (_req, res) => {
  console.info("Fetching products");

  res.json({
    products: ["Laptop", "Phone"],
  });
});

app.get("/error", (_req, res) => {
  console.error("Something went wrong");

  res.status(500).json({
    error: "Internal server error",
  });
});

const server = app.listen(3000, () => {
  console.log("Server running on port 3000");
});

process.on("SIGINT", async () => {
  console.log("Shutting down...");

  server.close();

  await guard.shutdown();

  process.exit(0);
});