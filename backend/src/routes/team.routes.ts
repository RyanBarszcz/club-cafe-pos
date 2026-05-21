import { Router } from "express";
import {
  createTeamMember,
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/team.controller.js";

const router = Router();

router.get("/", getTeamMembers);
router.post("/", createTeamMember);
router.patch("/:id", updateTeamMember);
router.delete("/:id", deleteTeamMember);

export default router;