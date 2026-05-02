/**
 * ProductForm Component
 * Handles both Create and Edit modes.
 */

import React, { useState, useEffect } from "react";
import LoggerService from "../services/loggerService";

function ProductForm({ onSubmit, onCancel, initialData }) {
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        price: initialData.price,
        category: initialData.category,
        stock: initialData.stock,
      });
      LoggerService.debug("component", `ProductForm loaded for edit id=${initialData.id}`);
    } else {
      LoggerService.debug("component", "ProductForm mounted in create mode");
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      await LoggerService.warn("component", "ProductForm validation failed - missing fields");
      alert("Name, price, and category are required!");
      return;
    }
    await LoggerService.info("component", `ProductForm submitted: ${form.name}`);
    onSubmit({
      name: form.name,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock) || 0,
    });
  };

  return (
    <div className="form-card">
      <h2>{isEdit ? "✏️ Edit Product" : "➕ Add Product"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Name *
            <input name="name" value={form.name} onChange={handleChange} placeholder="Product name" />
          </label>
          <label>
            Price (₹) *
            <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0" />
          </label>
          <label>
            Category *
            <input name="category" value={form.category} onChange={handleChange} placeholder="Electronics, Furniture..." />
          </label>
          <label>
            Stock
            <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">{isEdit ? "Update" : "Create"}</button>
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
