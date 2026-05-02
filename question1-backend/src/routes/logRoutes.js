/**
 * Log Relay Route
 * Allows the React frontend to send log entries through the backend
 * (avoids CORS issues when hitting the external log API directly).
 */

const express = require("express");
const router = express.Router();
const Logger = require("../utils/logger");

router.post("/", async (req, res) => {
  const { stack, level, package: pkg, message } = req.body;

  if (!stack || !level || !pkg || !message) {
    return res.status(400).json({
      success: false,
      error: "stack, level, package, and message are required",
    });
  }

  await Logger.send({ stack, level, package: pkg, message });
  res.json({ success: true, message: "Log forwarded successfully" });
});

module.exports = router;
