/**
 * App - Main Page
 * Composes all components; manages UI state and log history.
 */

import React, { useState, useCallback } from "react";
import ProductCard from "./components/ProductCard";
import ProductForm from "./components/ProductForm";
import LogPanel from "./components/LogPanel";
import { useProducts } from "./hooks/useProducts";
import LoggerService from "./services/loggerService";
import "./styles/App.css";

// Patch LoggerService.send to also push to local log history
const originalSend = LoggerService.send.bind(LoggerService);
let _pushLog = null;
LoggerService.send = async (opts) => {
  if (_pushLog) {
    _pushLog({
      time: new Date().toLocaleTimeString(),
      level: opts.level,
      package: opts.package,
      message: opts.message,
    });
  }
  return originalSend(opts);
};

function App() {
  const { products, loading, error, fetchAll, addProduct, editProduct, deleteProduct } =
    useProducts();

  const [showForm, setShowForm]         = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [logs, setLogs]                 = useState([]);
  const [showLogs, setShowLogs]         = useState(true);
  const [notification, setNotification] = useState(null);

  // Wire up the log panel
  _pushLog = useCallback((entry) => {
    setLogs((prev) => [...prev.slice(-99), entry]);
  }, []);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAdd = () => {
    LoggerService.info("page", "User opened Add Product form");
    setEditTarget(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    LoggerService.info("page", `User opened Edit form for id=${product.id}`);
    setEditTarget(product);
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editTarget) {
        await editProduct(editTarget.id, data);
        notify(`"${data.name}" updated!`);
        LoggerService.info("page", `Product id=${editTarget.id} updated successfully`);
      } else {
        await addProduct(data);
        notify(`"${data.name}" added!`);
        LoggerService.info("page", `New product "${data.name}" created`);
      }
      setShowForm(false);
      setEditTarget(null);
    } catch (err) {
      notify(err.response?.data?.error || err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      notify("Product deleted.");
      LoggerService.warn("page", `Product id=${id} removed by user`);
    } catch (err) {
      notify(err.message, "error");
    }
  };

  const handleCancel = () => {
    LoggerService.debug("page", "User cancelled form");
    setShowForm(false);
    setEditTarget(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo">⚡ LogStack</div>
          <span className="header-sub">Logging Middleware Demo</span>
        </div>
        <div className="header-actions">
          <button className="btn-ghost" onClick={() => setShowLogs((v) => !v)}>
            {showLogs ? "Hide Logs" : "Show Logs"}
          </button>
          <button className="btn-primary" onClick={handleAdd}>+ Add Product</button>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>{notification.msg}</div>
      )}

      {/* Main Layout */}
      <div className="app-layout">
        <main className="main-content">
          {showForm && (
            <ProductForm
              initialData={editTarget}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          )}

          <div className="section-header">
            <h2>Products <span className="badge">{products.length}</span></h2>
            <button className="btn-ghost-sm" onClick={fetchAll}>↻ Refresh</button>
          </div>

          {loading && <div className="status-msg">Loading products...</div>}
          {error   && <div className="status-msg error">⚠ {error}</div>}

          {!loading && !error && products.length === 0 && (
            <div className="status-msg">No products yet. Add one!</div>
          )}

          <div className="product-grid">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </main>

        {showLogs && <LogPanel logs={logs} />}
      </div>
    </div>
  );
}

export default App;
