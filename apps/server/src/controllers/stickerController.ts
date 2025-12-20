import { Request, Response } from "express";
import { reviews, stickers } from "../db/schema";
import { asc, desc, gte, ilike, lte, inArray, and, eq } from "drizzle-orm";
import { db } from "../db";
import { createStickerSchema, getStickersSchema, updateStickerSchema } from "../validationSchema/sticker.schema";

export const stickerController = {
    getStickers: async (req: Request, res: Response) => {
        try {
            const { page, limit, minPrice, maxPrice, q: search, sort, type } = req.query as any;

            const typeFilter = (type ? [type] : ["DIGITAL", "PHYSICAL"]) as ("DIGITAL" | "PHYSICAL")[];

            const sortMap = {
                'name_asc': asc(stickers.name),
                'name_desc': desc(stickers.name),
                'price_asc': asc(stickers.price),
                'price_desc': desc(stickers.price),
                'newest': desc(stickers.createdAt),
                'oldest': asc(stickers.createdAt),
            }

            const orderBy = sortMap[sort as keyof typeof sortMap] || desc(stickers.createdAt);

            const filter = [
                search ? ilike(stickers.name, `%${search}%`) : undefined,
                gte(stickers.price, minPrice.toString()),
                lte(stickers.price, maxPrice.toString()),
                inArray(stickers.type, typeFilter),
            ]

            const result = await db.query.stickers.findMany({
                where: and(...filter.filter(f => f !== undefined)),
                orderBy: orderBy,
                limit: limit,
                offset: (page - 1) * limit,
            });
            return res.json({ success: true, data: result, pagination: { page, limit, hasMore: result.length === limit } });
        } catch (error) {
            return res.status(500).json({ success: false, error: "Failed to fetch stickers" });
        }
    },

    addSticker: async (req: Request, res: Response) => {
        try {
            const shop = req.shop;
            const { name, description, images, price, type, stock } = req.body;

            const newSticker: typeof stickers.$inferInsert = {
                name,
                description: description || "",
                images,
                price,
                type,
                stock,
                shopId: shop.id,
                isPublished: false,
            }

            const result = await db.insert(stickers).values(newSticker).returning();

            return res.json({ success: true, data: result[0], message: "Sticker created successfully" });
        } catch (error) {
            console.error("Create sticker error:", error);
            return res.status(500).json({ success: false, error: "Failed to create sticker" });
        }
    },

    getStickerById: async (req: Request, res: Response) => {
        try {
            return res.json({ success: true, data: req.sticker, message: "Sticker fetched successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, error: "Failed to fetch sticker" });
        }
    },

    updateSticker: async (req: Request, res: Response) => {
        try {
            const sticker = req.sticker;
            const { name, description, images, price, type, stock } = req.body;

            const updateSticker: Partial<typeof stickers.$inferInsert> = {
                name,
                description: description || "",
                images,
                price,
                type,
                stock,
                isPublished: true,
            }

            const result = await db.update(stickers)
                .set(updateSticker)
                .where(eq(stickers.id, sticker.id))
                .returning();

            return res.json({ success: true, data: result[0], message: "Sticker updated successfully" });

        } catch (error) {
            console.error("Update sticker error:", error);
            return res.status(500).json({ success: false, error: "Failed to update sticker" });
        }
    },

    deleteSticker: async (req: Request, res: Response) => {
        try {
            const sticker = req.sticker;
            const result = await db.delete(stickers)
                .where(eq(stickers.id, sticker.id))
                .returning();

            return res.json({ success: true, data: result[0], message: "Sticker deleted successfully" });
        } catch (error) {
            console.error("Delete sticker error:", error);
            return res.status(500).json({ success: false, error: "Failed to delete sticker" });
        }
    },

    getStickerReviews: async (req: Request, res: Response) => {
        try {
            const sticker = req.sticker;

            const result = await db.query.reviews.findMany({
                where: eq(reviews.stickerId, sticker.id),
                with: {
                    user: true,
                }
            });
            return res.json({ success: true, data: result, message: "Reviews fetched successfully" });
        } catch (error) {
            console.error("Failed to get Reviews for sticker:", error);
            return res.status(500).json({ success: false, error: "Failed to get Reviews for sticker" });
        }
    }
}