/**
 * Frontend Logger Service
 * Sends structured log entries for the frontend stack via the backend relay.
 * Uses "frontend" as the stack identifier.
 */

import axios from "axios";

const RELAY_URL = "/api/logs"; // proxied to backend

const VALID_LEVELS   = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = [
  "component", "hook", "page", "state", "style",
  "api", "auth", "config", "utils", "middleware",
];

class LoggerService {
  static async send({ level, package: pkg, message }) {
    if (!VALID_LEVELS.includes(level) || !VALID_PACKAGES.includes(pkg)) {
      console.warn(`[FrontendLogger] Invalid level or package: ${level}, ${pkg}`);
      return;
    }
    try {
      await axios.post(RELAY_URL, {
        stack: "frontend",
        level,
        package: pkg,
        message,
      });
      console.log(`%c[LOG] ${level.toUpperCase()} [${pkg}] ${message}`,
        `color: ${levelColor(level)}`);
    } catch (err) {
      console.error("[FrontendLogger] Failed to relay log:", err.message);
    }
  }

  static debug(pkg, msg) { return LoggerService.send({ level: "debug", package: pkg, message: msg }); }
  static info(pkg, msg)  { return LoggerService.send({ level: "info",  package: pkg, message: msg }); }
  static warn(pkg, msg)  { return LoggerService.send({ level: "warn",  package: pkg, message: msg }); }
  static error(pkg, msg) { return LoggerService.send({ level: "error", package: pkg, message: msg }); }
  static fatal(pkg, msg) { return LoggerService.send({ level: "fatal", package: pkg, message: msg }); }
}

function levelColor(level) {
  return { debug: "#888", info: "#4ade80", warn: "#facc15", error: "#f87171", fatal: "#c084fc" }[level] || "#fff";
}

export default LoggerService;
