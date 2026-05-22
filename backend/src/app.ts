import express from "express";
import cors from "cors";
import productsRoutes from "./routes/products.routes.js";
import transactionsRoutes from "./routes/transactions.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import teamRoutes from "./routes/team.routes.js";
import settingsRoutes from './routes/settings.routes.js';
import { clerkMiddleware } from "@clerk/express";



const app = express();

app.use(clerkMiddleware());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Liberty POS backend is running",
  });
});

app.use("/products", productsRoutes);
app.use("/transactions", transactionsRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/admin", adminRoutes);
app.use("/team", teamRoutes);
app.use("/settings", settingsRoutes);

export default app;