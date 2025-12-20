import { z } from "zod";

const shopSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").max(50, "Name cannot be longer than 50 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").optional(),
})

export const createShopSchema = z.object({
    body: shopSchema
})

export const updateShopSchema = z.object({
    body: shopSchema.partial()
})

export type CreateShopInput = z.infer<typeof createShopSchema>['body'];
export type UpdateShopInput = z.infer<typeof updateShopSchema>['body'];
