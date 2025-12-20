import { z } from "zod";

export const addToCartSchema = z.object({
    body: z.object({
        stickerId: z.uuid("Invalid sticker ID format"),
        quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
    }),
});

export const updateCartItemSchema = z.object({
    body: z.object({
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
    }),
});
