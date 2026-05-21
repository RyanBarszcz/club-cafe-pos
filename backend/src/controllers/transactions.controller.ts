import type { Request, Response } from "express";
import type { Product, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { createTransactionSchema } from "../validators/transaction.schema.js";

const TAX_RATE = 0.06;

export async function createTransaction(req: Request, res: Response) {
  try {
    const parsed = createTransactionSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid transaction data",
        errors: parsed.error.flatten(),
      });
    }

    const { mode, paymentMethod, externalMemberId, memberNameSnapshot, items } =
      parsed.data;

    const productIds = items.map((item) => item.productId);

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        active: true,
      },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        message: "One or more products are invalid or inactive",
      });
    }

    const productMap = new Map<string, Product>(
        products.map((product: Product) => [product.id, product])
        );
        
    const subtotalCents = items.reduce((sum, item) => {
      const product = productMap.get(item.productId);

      if (!product) return sum;

      return sum + product.priceCents * item.quantity;
    }, 0);

    const taxCents = Math.round(subtotalCents * TAX_RATE);
    const totalCents = subtotalCents + taxCents;

    const transaction = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const item of items) {
        const product = productMap.get(item.productId);

        if (!product) {
          throw new Error("Product not found");
        }

        if (product.inventoryCount < item.quantity) {
          throw new Error(`${product.name} does not have enough inventory`);
        }

        await tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            inventoryCount: {
              decrement: item.quantity,
            },
          },
        });
      }

      return tx.transaction.create({
        data: {
          mode,
          paymentMethod,
          externalMemberId,
          memberNameSnapshot,
          subtotalCents,
          taxCents,
          totalCents,
          items: {
            create: items.map((item) => {
              const product = productMap.get(item.productId);

              if (!product) {
                throw new Error("Product not found");
              }

              return {
                productId: product.id,
                productNameSnapshot: product.name,
                unitPriceCentsSnapshot: product.priceCents,
                quantity: item.quantity,
                lineTotalCents: product.priceCents * item.quantity,
              };
            }),
          },
        },
        include: {
          items: true,
        },
      });
    });

    return res.status(201).json({
      message: "Transaction created",
      transaction,
    });
  } catch (error) {
    console.error("createTransaction error:", error);

    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to create transaction",
    });
  }
}

export async function getTransactions(req: Request, res: Response) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const sortBy = String(req.query.sortBy || "createdAt");
        const sortOrder = String(req.query.sortOrder || "desc");

        const allowedSortFields = ["createdAt", "totalCents", "subtotal", "tax"];

        const safeSortBy = allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";

        const safeSortOrder = sortOrder === "asc" ? "asc" : "desc";

        const skip = (page - 1) * limit;

        const [transactions, totalCount] = await Promise.all([
            prisma.transaction.findMany({
                skip,
                take: limit,
                orderBy: {
                    [safeSortBy]: safeSortOrder,
                },
                include: {
                    items: true,
                    // member: true,
                    staffUser: true,
                },
            }),

            prisma.transaction.count(),
        ]);

        return res.status(200).json({
            transactions,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (error) {
        console.error("Get transactions error:", error);

        return res.status(500).json({
            message: "Failed to fetch transactions",
        });
    }
}