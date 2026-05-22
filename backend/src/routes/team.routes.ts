import { Router } from "express";
import {
  createTeamMember,
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/team.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, getTeamMembers);
router.post("/", requireAuth, requireAdmin, createTeamMember);
router.patch("/:id", requireAuth, requireAdmin, updateTeamMember);
router.delete("/:id", requireAuth, requireAdmin, deleteTeamMember);

export default router;