import express from "express";
import cors from "cors";
import productsRoutes from "./routes/products.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Liberty POS backend is running",
  });
});

app.use("/products", productsRoutes);

export default app;