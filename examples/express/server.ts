import express from "express";
import { RuntimeGuard } from "../../src";

const app = express();

const guard = new RuntimeGuard({
  serviceName: "test-api",
  environment: "development"
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

app.listen(3000, () => {
  console.log("Server running on port 3000");
});