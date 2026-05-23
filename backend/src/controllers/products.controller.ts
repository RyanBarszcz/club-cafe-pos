import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { createProductSchema, updateProductSchema } from "../validators/product.schema.js";

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

export async function createProduct(req: Request, res: Response) {
    try {
        const parsed = createProductSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid product data",
                errors: parsed.error.flatten(),
            });
        }

        const product = await prisma.product.create({
            data: {
                name: parsed.data.name,
                category: parsed.data.category,
                priceCents: parsed.data.priceCents,
                description: parsed.data.description ?? null,
                imageUrl: parsed.data.imageUrl ?? null,
                isHotFood: parsed.data.isHotFood ?? false,
                isSelfServeEnabled: parsed.data.isSelfServeEnabled ?? true,
                inventoryCount: parsed.data.inventoryCount,
                lowStockThreshold: parsed.data.lowStockThreshold ?? 5,
            },
        });

        return res.status(201).json({
            message: "Product created",
            product,
        });
    } catch (error) {
        console.error("createProduct error:", error);

        return res.status(500).json({
            message: "Failed to create product",
        });
    }
}

export async function updateProduct(req: Request, res: Response) {
    try {
        const parsed = updateProductSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid product data",
                errors: parsed.error.flatten(),
            });
        }

        const { id } = req.params;

        if (typeof id !== "string") {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...parsed.data,
                description: parsed.data.description ?? undefined,
                imageUrl: parsed.data.imageUrl ?? undefined,
            },
        });

        return res.json({ message: "Product updated", product });
    } catch (error) {
        console.error("updateProduct error:", error);
        return res.status(500).json({ message: "Failed to update product" });
    }
}

export async function deleteProduct(req: Request, res: Response) {
    try {

        const { id } = req.params;

        if (typeof id !== "string") {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const product = await prisma.product.update({
            where: { id },
            data: { active: false },
        });

        return res.json({ message: "Product deleted", product });
    } catch (error) {
        console.error("deleteProduct error:", error);
        return res.status(500).json({ message: "Failed to delete product" });
    }
}