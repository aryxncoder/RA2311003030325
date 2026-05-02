/**
 * LogPanel Component
 * Real-time display of log events fired during app usage.
 */

import React from "react";

const LEVEL_COLORS = {
  debug: "#94a3b8",
  info:  "#4ade80",
  warn:  "#facc15",
  error: "#f87171",
  fatal: "#c084fc",
};

function LogPanel({ logs }) {
  return (
    <div className="log-panel">
      <div className="log-panel-header">
        <span className="log-dot" /> Live Logs
        <span className="log-count">{logs.length} entries</span>
      </div>
      <div className="log-list">
        {logs.length === 0 && (
          <div className="log-empty">Interact with the app to see logs...</div>
        )}
        {[...logs].reverse().map((log, i) => (
          <div key={i} className="log-entry">
            <span className="log-time">{log.time}</span>
            <span
              className="log-level"
              style={{ color: LEVEL_COLORS[log.level] || "#fff" }}
            >
              {log.level.toUpperCase()}
            </span>
            <span className="log-pkg">[{log.package}]</span>
            <span className="log-msg">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogPanel;
