import { Router } from "express";
import { createTransaction, getTransactions } from "../controllers/transactions.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { adminLimiter, transactionLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post("/", transactionLimiter, createTransaction);
router.get("/", requireAuth, requireAdmin, adminLimiter, getTransactions);

export default router;