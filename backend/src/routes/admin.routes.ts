import { Router } from "express";
import { getAdminDashboard } from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { adminLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.get("/dashboard", requireAuth, requireAdmin, adminLimiter, getAdminDashboard);

export default router;