import { z } from "zod";

// Base schemas for internal reuse if needed
const stickerBodySchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name cannot be longer than 50 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").optional(),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
    images: z.array(z.url("Must be a valid URL")).min(1, "At least one image is required"),
    type: z.enum(["DIGITAL", "PHYSICAL"]),
    stock: z.number().int().min(0, "Stock cannot be negative"),
});

export const getStickersSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().min(1).max(100).default(10),
        minPrice: z.coerce.number().min(0).default(0),
        maxPrice: z.coerce.number().max(1000).default(1000),
        q: z.string().optional(),
        sort: z
            .enum(["name_asc", "name_desc", "price_asc", "price_desc", "newest", "oldest"])
            .default("newest"),
        type: z.enum(["DIGITAL", "PHYSICAL"]).optional(),
    }),
});

export const createStickerSchema = z.object({
    body: stickerBodySchema,
});

export const updateStickerSchema = z.object({
    body: stickerBodySchema.partial(),
});

export type CreateStickerInput = z.infer<typeof stickerBodySchema>;
export type GetStickersQuery = z.infer<typeof getStickersSchema>["query"];
