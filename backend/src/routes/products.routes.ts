import { Router } from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { adminLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.get("/", getProducts);

router.post("/", requireAuth, requireAdmin, adminLimiter, createProduct);
router.patch("/:id", requireAuth, requireAdmin, adminLimiter, updateProduct);
router.delete("/:id", requireAuth, requireAdmin, adminLimiter, deleteProduct);

export default router;