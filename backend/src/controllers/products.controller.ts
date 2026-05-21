import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getProducts(_req: Request, res: Response) {
  const products = await prisma.product.findMany({
    where: {
      active: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  res.json({ products });
}