import { Request, Response } from "express";
import { reviews, stickers } from "../db/schema";
import { asc, desc, gte, ilike, lte, inArray, and, eq } from "drizzle-orm";
import { db } from "../db";

export const stickerController = {
    getStickers: async (req: Request, res: Response) => {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Number(req.query.limit) || 10);

        const minPrice = req.query.minPrice ? req.query.minPrice.toString() : "0";
        const maxPrice = req.query.maxPrice ? req.query.maxPrice.toString() : "1000";
        const search = req.query.q as string || "";
        const sort = req.query.sort || "newest";

        const typeQuery = req.query.type as string;
        const typeFilter = (typeQuery ? [typeQuery] : ["DIGITAL", "PHYSICAL"]) as ("DIGITAL" | "PHYSICAL")[];

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
            gte(stickers.price, minPrice),
            lte(stickers.price, maxPrice),
            inArray(stickers.type, typeFilter),
        ]

        try {
            const result = await db.query.stickers.findMany({
                where: and(...filter.filter(f => f !== undefined)),
                orderBy: orderBy,
                limit: limit,
                offset: (page - 1) * limit,
            });
            return res.json({ success: true, data: result });
        } catch (error) {
            return res.status(500).json({ success: false, error: "Failed to fetch stickers" });
        }
    },

    addSticker: async (req: Request, res: Response) => {
        try {
            const { shop } = req.body;
            if (!shop) {
                return res.status(401).json({ success: false, error: "Unauthorized" });
            }

            const { name, description, images, price, type, stock } = req.body;

            if (!name || !description || !images || !price || !type || stock === undefined) {
                return res.status(400).json({ success: false, error: "Missing required fields" });
            }

            const newSticker: typeof stickers.$inferInsert = {
                name: name.toString(),
                description: description.toString(),
                images: Array.isArray(images) ? images.map(String) : [String(images)],
                price: price.toString(),
                type: type.toString() as ("DIGITAL" | "PHYSICAL"),
                stock: Number(stock),
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
            const id = req.params.id;
            if (!id) {
                return res.status(404).json({ success: false, error: "sticker not found" });
            }
            const result = await db.query.stickers.findFirst({
                where: eq(stickers.id, id),
                with: {
                    shop: true,
                    reviews: true,
                }
            });
            return res.json({ success: true, data: result, message: "Sticker fetched successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, error: "Failed to fetch sticker" });
        }
    },

    updateSticker: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const { shop } = req.body;
            if (!id) {
                return res.status(404).json({ success: false, error: "sticker not found" });
            }
            const existingSticker = await db.query.stickers.findFirst({
                where: eq(stickers.id, id),
                with: {
                    shop: true,
                }
            });

            if (!existingSticker) {
                return res.status(404).json({ success: false, error: "Sticker not found" });
            }

            if (existingSticker.shopId !== shop.id) {
                return res.status(403).json({ success: false, error: "Unauthorized: You do not own this sticker" });
            }

            const { name, description, images, price, type, stock } = req.body;

            if (!name || !description || !images || !price || !type || stock === undefined) {
                return res.status(400).json({ success: false, error: "Missing required fields" });
            }

            const updateSticker: Partial<typeof stickers.$inferInsert> = {
                name: name.toString(),
                description: description.toString(),
                images: Array.isArray(images) ? images.map(String) : [String(images)],
                price: price.toString(),
                type: type.toString() as ("DIGITAL" | "PHYSICAL"),
                stock: Number(stock),
            }

            const result = await db.update(stickers)
                .set(updateSticker)
                .where(eq(stickers.id, id))
                .returning();

            return res.json({ success: true, data: result[0], message: "Sticker updated successfully" });

        } catch (error) {
            console.error("Update sticker error:", error);
            return res.status(500).json({ success: false, error: "Failed to update sticker" });
        }
    },

    deleteSticker: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const { shop } = req.body;

            if (!id) {
                return res.status(404).json({ success: false, error: "sticker not found" });
            }
            const existingSticker = await db.query.stickers.findFirst({
                where: eq(stickers.id, id),
            });

            if (!existingSticker) {
                return res.status(404).json({ success: false, error: "Sticker not found" });
            }

            if (existingSticker.shopId !== shop.id) {
                return res.status(403).json({ success: false, error: "Unauthorized: You do not own this sticker" });
            }

            const result = await db.delete(stickers)
                .where(eq(stickers.id, id))
                .returning();

            return res.json({ success: true, data: result[0], message: "Sticker deleted successfully" });
        } catch (error) {
            console.error("Delete sticker error:", error);
            return res.status(500).json({ success: false, error: "Failed to delete sticker" });
        }
    },

    getStickerReviews: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) return res.status(404).json({ success: false, error: "sticker not found" });

            const result = await db.query.reviews.findMany({
                where: eq(reviews.stickerId, id),
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