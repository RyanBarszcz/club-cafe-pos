import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1),
    category: z.enum([
        "DRINKS",
        "SNACKS",
        "PROTEIN",
        "HOT_FOOD",
        "GRAB_AND_GO",
        "MERCH",
    ]),
    priceCents: z.number().int().nonnegative(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    isHotFood: z.boolean().optional(),
    isSelfServeEnabled: z.boolean().optional(),
    inventoryCount: z.number().int().nonnegative(),
    lowStockThreshold: z.number().int().nonnegative().optional(),
});

export const updateProductSchema = createProductSchema.partial();