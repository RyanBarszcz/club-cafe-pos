import { Router } from "express";
import {
  createTeamMember,
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/team.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { adminLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, adminLimiter, getTeamMembers);
router.post("/", requireAuth, requireAdmin, adminLimiter, createTeamMember);
router.patch("/:id", requireAuth, requireAdmin, adminLimiter, updateTeamMember);
router.delete("/:id", requireAuth, requireAdmin, adminLimiter, deleteTeamMember);

export default router;