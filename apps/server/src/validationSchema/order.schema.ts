import { z } from "zod";

export const createOrderSchema = z.object({
    body: z.object({
        cartId: z.uuid("Invalid cart ID format"),
    }),
});
