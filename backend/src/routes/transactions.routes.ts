import { Router } from "express";
import { createTransaction, getTransactions } from "../controllers/transactions.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.post("/", requireAuth, createTransaction);
router.get("/", requireAuth, requireAdmin, getTransactions);

export default router;