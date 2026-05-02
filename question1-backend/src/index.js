/**
 * Application Entry Point
 * Bootstraps Express with all middleware, routes, and error handling.
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { attachRequestId, logRequest, logResponse, logError } = require("./middleware/requestLogger");
const productRoutes = require("./routes/productRoutes");
const logRoutes = require("./routes/logRoutes");
const Logger = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Logging Middleware (order matters) ──────────────────────────────────────
app.use(attachRequestId);
app.use(logRequest);
app.use(logResponse);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ success: true, message: "Logging Middleware API is running 🚀" });
});

app.use("/api/products", productRoutes);
app.use("/api/logs",     logRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use(async (req, res) => {
  await Logger.warn("route", `404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, error: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(logError);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || "development"}\n`);
  await Logger.info("config", `Server started on port ${PORT}`);
});

module.exports = app;
