import { z } from "zod";

export const createTransactionSchema = z.object({
  mode: z.enum(["KIOSK", "STAFF"]),
  paymentMethod: z.enum(["MEMBER_ACCOUNT", "CARD", "CASH"]),
  externalMemberId: z.string().optional(),
  memberNameSnapshot: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});