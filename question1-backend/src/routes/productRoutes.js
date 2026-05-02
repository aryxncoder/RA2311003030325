/**
 * Product Routes
 * Defines all /api/products endpoints.
 */

const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");
const Logger = require("../utils/logger");

// Log every access to this router
router.use(async (req, _res, next) => {
  await Logger.debug("route", `Product route hit: ${req.method} ${req.originalUrl}`);
  next();
});

router.get("/",        ProductController.getAll);
router.get("/:id",     ProductController.getById);
router.post("/",       ProductController.create);
router.put("/:id",     ProductController.update);
router.delete("/:id",  ProductController.remove);

module.exports = router;
