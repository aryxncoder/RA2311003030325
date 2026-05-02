/**
 * ProductCard Component
 * Displays a single product with edit/delete actions.
 */

import React from "react";
import LoggerService from "../services/loggerService";

function ProductCard({ product, onEdit, onDelete }) {
  const handleEdit = () => {
    LoggerService.info("component", `ProductCard: edit clicked for id=${product.id}`);
    onEdit(product);
  };

  const handleDelete = () => {
    LoggerService.warn("component", `ProductCard: delete clicked for id=${product.id}`);
    if (window.confirm(`Delete "${product.name}"?`)) {
      onDelete(product.id);
    }
  };

  return (
    <div className="product-card">
      <div className="product-badge">{product.category}</div>
      <h3>{product.name}</h3>
      <div className="product-meta">
        <span className="price">₹{product.price.toLocaleString()}</span>
        <span className={`stock ${product.stock < 5 ? "low" : ""}`}>
          {product.stock < 5 ? "⚠️" : "✅"} {product.stock} in stock
        </span>
      </div>
      <div className="card-actions">
        <button className="btn-edit" onClick={handleEdit}>Edit</button>
        <button className="btn-delete" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default ProductCard;
