/**
 * Product Controller
 * Handles HTTP request/response cycle.
 * Delegates all business logic to ProductService.
 */

const ProductService = require("../services/productService");
const Logger = require("../utils/logger");

class ProductController {
  static async getAll(req, res, next) {
    try {
      await Logger.debug("handler", `GET /api/products - requestId: ${req.requestId}`);
      const products = await ProductService.getAll();
      res.json({ success: true, count: products.length, data: products });
    } catch (err) {
      await Logger.error("handler", `getAll failed: ${err.message}`);
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      await Logger.debug("handler", `GET /api/products/${req.params.id}`);
      const product = await ProductService.getById(req.params.id);

      if (!product) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      res.json({ success: true, data: product });
    } catch (err) {
      await Logger.error("handler", `getById failed: ${err.message}`);
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, price, category, stock } = req.body;

      if (!name || price === undefined || !category) {
        await Logger.warn("handler", "create: missing required fields");
        return res.status(400).json({
          success: false,
          error: "name, price, and category are required",
        });
      }

      await Logger.debug("handler", `POST /api/products - creating "${name}"`);
      const product = await ProductService.create({ name, price, category, stock: stock || 0 });
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      await Logger.error("handler", `create failed: ${err.message}`);
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      await Logger.debug("handler", `PUT /api/products/${req.params.id}`);
      const product = await ProductService.update(req.params.id, req.body);

      if (!product) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      res.json({ success: true, data: product });
    } catch (err) {
      await Logger.error("handler", `update failed: ${err.message}`);
      next(err);
    }
  }

  static async remove(req, res, next) {
    try {
      await Logger.debug("handler", `DELETE /api/products/${req.params.id}`);
      const deleted = await ProductService.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      res.json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
      await Logger.error("handler", `delete failed: ${err.message}`);
      next(err);
    }
  }
}

module.exports = ProductController;
