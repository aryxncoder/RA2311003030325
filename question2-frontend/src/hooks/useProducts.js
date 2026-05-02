/**
 * useProducts Hook
 * Manages product state and wraps ProductAPI with logging.
 */

import { useState, useEffect, useCallback } from "react";
import ProductAPI from "../services/productAPI";
import LoggerService from "../services/loggerService";

export function useProducts() {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    await LoggerService.debug("hook", "useProducts.fetchAll triggered");
    try {
      const data = await ProductAPI.getAll();
      setProducts(data);
      await LoggerService.info("hook", `useProducts: loaded ${data.length} products`);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      await LoggerService.error("hook", `useProducts.fetchAll error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (data) => {
    await LoggerService.info("hook", `useProducts.addProduct: ${data.name}`);
    const product = await ProductAPI.create(data);
    setProducts((prev) => [...prev, product]);
    return product;
  };

  const editProduct = async (id, data) => {
    await LoggerService.info("hook", `useProducts.editProduct id=${id}`);
    const updated = await ProductAPI.update(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const deleteProduct = async (id) => {
    await LoggerService.warn("hook", `useProducts.deleteProduct id=${id}`);
    await ProductAPI.remove(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    LoggerService.info("hook", "useProducts mounted - initial fetch");
    fetchAll();
  }, [fetchAll]);

  return { products, loading, error, fetchAll, addProduct, editProduct, deleteProduct };
}
