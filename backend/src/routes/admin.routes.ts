import { Router } from "express";
import { getAdminDashboard } from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/dashboard", requireAuth, requireAdmin, getAdminDashboard);

export default router;