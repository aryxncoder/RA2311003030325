/**
 * Product API Service
 * Centralized axios calls for all product endpoints.
 * Every call is logged via LoggerService.
 */

import axios from "axios";
import LoggerService from "./loggerService";

const BASE = "/api/products";

const ProductAPI = {
  async getAll() {
    await LoggerService.info("api", "Fetching all products");
    try {
      const res = await axios.get(BASE);
      await LoggerService.info("api", `Fetched ${res.data.count} products`);
      return res.data.data;
    } catch (err) {
      await LoggerService.error("api", `getAll failed: ${err.message}`);
      throw err;
    }
  },

  async getById(id) {
    await LoggerService.debug("api", `Fetching product id=${id}`);
    try {
      const res = await axios.get(`${BASE}/${id}`);
      await LoggerService.info("api", `Fetched product: ${res.data.data.name}`);
      return res.data.data;
    } catch (err) {
      await LoggerService.warn("api", `getById(${id}) failed: ${err.message}`);
      throw err;
    }
  },

  async create(data) {
    await LoggerService.info("api", `Creating product: ${data.name}`);
    try {
      const res = await axios.post(BASE, data);
      await LoggerService.info("api", `Product created with id=${res.data.data.id}`);
      return res.data.data;
    } catch (err) {
      await LoggerService.error("api", `create failed: ${err.message}`);
      throw err;
    }
  },

  async update(id, data) {
    await LoggerService.info("api", `Updating product id=${id}`);
    try {
      const res = await axios.put(`${BASE}/${id}`, data);
      await LoggerService.info("api", `Product id=${id} updated`);
      return res.data.data;
    } catch (err) {
      await LoggerService.error("api", `update(${id}) failed: ${err.message}`);
      throw err;
    }
  },

  async remove(id) {
    await LoggerService.warn("api", `Deleting product id=${id}`);
    try {
      await axios.delete(`${BASE}/${id}`);
      await LoggerService.info("api", `Product id=${id} deleted`);
    } catch (err) {
      await LoggerService.error("api", `delete(${id}) failed: ${err.message}`);
      throw err;
    }
  },
};

export default ProductAPI;
