import { Router } from "express";
import { getProductAnalytics } from "../controllers/analytics.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { adminLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.get("/products", requireAuth, requireAdmin, adminLimiter, getProductAnalytics);

export default router;