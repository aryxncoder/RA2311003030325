/**
 * Product Service
 * Business logic layer for product operations.
 * All operations are logged at appropriate levels.
 */

const Logger = require("../utils/logger");

// In-memory "database" (simulates a repository)
const productsDB = [
  { id: 1, name: "Mechanical Keyboard", price: 4999, category: "Electronics", stock: 12 },
  { id: 2, name: "Ergonomic Chair",     price: 15999, category: "Furniture",    stock: 5  },
  { id: 3, name: "Noise-Cancel Headphones", price: 7499, category: "Electronics", stock: 20 },
  { id: 4, name: "Standing Desk",       price: 24999, category: "Furniture",    stock: 3  },
];

let nextId = 5;

class ProductService {
  /**
   * Retrieve all products.
   */
  static async getAll() {
    await Logger.info("service", "ProductService.getAll called");
    return productsDB;
  }

  /**
   * Find a single product by ID.
   * @param {number} id
   */
  static async getById(id) {
    await Logger.debug("service", `ProductService.getById called with id=${id}`);

    const product = productsDB.find((p) => p.id === Number(id));
    if (!product) {
      await Logger.warn("service", `ProductService.getById: product id=${id} not found`);
      return null;
    }

    await Logger.info("service", `ProductService.getById: found product "${product.name}"`);
    return product;
  }

  /**
   * Create a new product.
   * @param {Object} data
   */
  static async create(data) {
    await Logger.info("service", `ProductService.create called with name="${data.name}"`);

    const product = { id: nextId++, ...data };
    productsDB.push(product);

    await Logger.info("service", `ProductService.create: product id=${product.id} created`);
    return product;
  }

  /**
   * Update an existing product.
   * @param {number} id
   * @param {Object} data
   */
  static async update(id, data) {
    await Logger.info("service", `ProductService.update called for id=${id}`);

    const idx = productsDB.findIndex((p) => p.id === Number(id));
    if (idx === -1) {
      await Logger.warn("service", `ProductService.update: product id=${id} not found`);
      return null;
    }

    productsDB[idx] = { ...productsDB[idx], ...data };
    await Logger.info("service", `ProductService.update: product id=${id} updated`);
    return productsDB[idx];
  }

  /**
   * Delete a product by ID.
   * @param {number} id
   */
  static async delete(id) {
    await Logger.info("service", `ProductService.delete called for id=${id}`);

    const idx = productsDB.findIndex((p) => p.id === Number(id));
    if (idx === -1) {
      await Logger.warn("service", `ProductService.delete: product id=${id} not found`);
      return false;
    }

    productsDB.splice(idx, 1);
    await Logger.info("service", `ProductService.delete: product id=${id} deleted`);
    return true;
  }
}

module.exports = ProductService;
