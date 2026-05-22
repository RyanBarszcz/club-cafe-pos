import { Router } from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { adminLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, adminLimiter, getSettings);
router.patch("/", requireAuth, requireAdmin, adminLimiter, updateSettings);

export default router;