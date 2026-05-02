/**
 * Logger Utility
 * Abstraction layer for sending structured logs to the external logging API.
 * All log levels are supported: debug, info, warn, error, fatal.
 */

const axios = require("axios");

const LOG_API_URL =
  process.env.LOG_API_URL || "http://20.207.122.201/evaluation-service/logs";

const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = [
  "handler",
  "repository",
  "route",
  "service",
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style",
  "auth",
  "config",
  "middleware",
  "utils",
];

class Logger {
  /**
   * Send a log entry to the external logging API.
   * @param {Object} params
   * @param {"backend"|"frontend"} params.stack
   * @param {"debug"|"info"|"warn"|"error"|"fatal"} params.level
   * @param {string} params.package
   * @param {string} params.message
   */
  static async send({ stack = "backend", level, package: pkg, message }) {
    if (!VALID_LEVELS.includes(level)) {
      console.warn(`[Logger] Invalid level: ${level}`);
      return;
    }
    if (!VALID_PACKAGES.includes(pkg)) {
      console.warn(`[Logger] Invalid package: ${pkg}`);
      return;
    }

    const payload = { stack, level, package: pkg, message };

    try {
      await axios.post(LOG_API_URL, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 5000,
      });
      console.log(`[Logger] ✓ ${level.toUpperCase()} [${pkg}] ${message}`);
    } catch (err) {
      // Never let logging failures crash the app
      console.error(
        `[Logger] ✗ Failed to send log: ${err.message}`
      );
    }
  }

  static debug(pkg, message) {
    return Logger.send({ stack: "backend", level: "debug", package: pkg, message });
  }

  static info(pkg, message) {
    return Logger.send({ stack: "backend", level: "info", package: pkg, message });
  }

  static warn(pkg, message) {
    return Logger.send({ stack: "backend", level: "warn", package: pkg, message });
  }

  static error(pkg, message) {
    return Logger.send({ stack: "backend", level: "error", package: pkg, message });
  }

  static fatal(pkg, message) {
    return Logger.send({ stack: "backend", level: "fatal", package: pkg, message });
  }
}

module.exports = Logger;
