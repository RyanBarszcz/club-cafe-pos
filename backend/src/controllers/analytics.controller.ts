import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

type AnalyticsRange = "daily" | "weekly" | "monthly" | "ytd";

function getStartDate(range: AnalyticsRange) {
  const now = new Date();

  if (range === "daily") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  if (range === "weekly") {
    const day = now.getDay();
    const diff = now.getDate() - day;
    return new Date(now.getFullYear(), now.getMonth(), diff);
  }

  if (range === "monthly") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return new Date(now.getFullYear(), 0, 1);
}

export async function getProductAnalytics(req: Request, res: Response) {
  try {
    const range = (req.query.range as AnalyticsRange) || "daily";

    if (!["daily", "weekly", "monthly", "ytd"].includes(range)) {
      return res.status(400).json({
        message: "Invalid range. Use daily, weekly, monthly, or ytd.",
      });
    }

    const startDate = getStartDate(range);

    const transactionItems = await prisma.transactionItem.findMany({
      where: {
        transaction: {
          status: "COMPLETED",
          createdAt: {
            gte: startDate,
          },
        },
      },
      include: {
        product: true,
      },
    });

    const productMap = new Map<
      string,
      {
        id: string;
        name: string;
        category: string;
        unitsSold: number;
        revenueCents: number;
      }
    >();

    for (const item of transactionItems) {
      const id = item.productId ?? item.productNameSnapshot;

      const existing = productMap.get(id);

      if (existing) {
        existing.unitsSold += item.quantity;
        existing.revenueCents += item.lineTotalCents;
      } else {
        productMap.set(id, {
          id,
          name: item.productNameSnapshot,
          category: item.product?.category ?? "UNKNOWN",
          unitsSold: item.quantity,
          revenueCents: item.lineTotalCents,
        });
      }
    }

    const products = Array.from(productMap.values()).sort(
      (a, b) => b.revenueCents - a.revenueCents
    );

    const revenueCents = products.reduce(
      (sum, product) => sum + product.revenueCents,
      0
    );

    const unitsSold = products.reduce(
      (sum, product) => sum + product.unitsSold,
      0
    );

    const bestSeller =
      products.length > 0
        ? [...products].sort((a, b) => b.unitsSold - a.unitsSold)[0]
        : null;

    return res.json({
      range,
      summary: {
        revenueCents,
        unitsSold,
        bestSeller,
      },
      products,
    });
  } catch (error) {
    console.error("getProductAnalytics error:", error);

    return res.status(500).json({
      message: "Failed to fetch product analytics",
    });
  }
}