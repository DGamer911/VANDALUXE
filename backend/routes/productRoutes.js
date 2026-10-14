
import express from "express";

import {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateInventory,
  updateProductStatus,
} from "../controllers/productController.js";

import protectAdmin from "../middleware/adminAuth.js";

const router = express.Router();

// Admin routes: register /admin/all before /:id.
router.get("/admin/all", protectAdmin, getAdminProducts);

router.post("/", protectAdmin, createProduct);
router.put("/:id", protectAdmin, updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

router.patch("/:id/inventory", protectAdmin, updateInventory);
router.patch("/:id/status", protectAdmin, updateProductStatus);

// Public storefront routes.
router.get("/", getProducts);
router.get("/:id", getProductById);

export default router;
