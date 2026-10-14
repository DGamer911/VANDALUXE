import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import dns from "node:dns";

import connectDB from "./config/db.js";

import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = new Set(
  (
    process.env.CLIENT_URL ||
    "http://localhost:5173,http://localhost:3000"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use(express.json({ limit: "20kb" }));

console.log("Allowed frontend origins:", [...allowedOrigins]);

// CORS must run before API routes.
app.use((req, res, next) => {
  const origin = req.get("Origin");

  if (origin && !allowedOrigins.has(origin)) {
    return res.status(403).json({
      error: "Origin not allowed",
      receivedOrigin: origin,
    });
  }

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Existing routes.
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// New public contact submission endpoint.
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Vandaluxe API is running" });
});

app.get("/api/health", (req, res) => {
  const states = [
    "disconnected",
    "connected",
    "connecting",
    "disconnecting",
  ];

  res.json({
    status: "ok",
    database: states[mongoose.connection.readyState] ?? "unknown",
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

async function startServer() {
  if (!process.env.DB_URL) {
    throw new Error("DB_URL is missing. Set it in backend/.env.");
  }

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Vandaluxe server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});