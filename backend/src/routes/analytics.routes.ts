import { Router } from "express";
import { getProductAnalytics } from "../controllers/analytics.controller.js";

const router = Router();

router.get("/products", getProductAnalytics);

export default router;