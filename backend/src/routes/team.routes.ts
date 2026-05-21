import { Router } from "express";
import { createTeamMember } from "../controllers/team.controller.js";

const router = Router();

router.post("/", createTeamMember);

export default router;