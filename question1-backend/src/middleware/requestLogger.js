/**
 * Request Logger Middleware
 * Intercepts every incoming HTTP request and outgoing response,
 * then ships structured log entries to the external logging API.
 */

const { v4: uuidv4 } = require("uuid");
const Logger = require("../utils/logger");

/**
 * Attach a unique requestId to each request for tracing.
 */
const attachRequestId = (req, _res, next) => {
  req.requestId = uuidv4();
  next();
};

/**
 * Log every incoming request (info level).
 */
const logRequest = async (req, _res, next) => {
  const message = `[${req.requestId}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`;
  await Logger.info("middleware", message);
  next();
};

/**
 * Log every outgoing response with status code and duration.
 */
const logResponse = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
    const message = `[${req.requestId}] ${req.method} ${req.originalUrl} -> ${status} (${duration}ms)`;
    await Logger.send({ stack: "backend", level, package: "middleware", message });
  });

  next();
};

/**
 * Global error-handling middleware — logs fatal/error level entries.
 */
const logError = async (err, req, res, _next) => {
  const message = `[${req.requestId}] UNHANDLED ERROR on ${req.method} ${req.originalUrl}: ${err.message}`;
  await Logger.fatal("middleware", message);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};

module.exports = { attachRequestId, logRequest, logResponse, logError };
