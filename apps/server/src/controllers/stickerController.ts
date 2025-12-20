import { Request, Response } from "express";
import { reviews, stickers } from "../db/schema";
import { asc, desc, gte, ilike, lte, inArray, and, eq } from "drizzle-orm";
import { db } from "../db";
import { asyncHandler } from "../utils/asyncHandler";

export const stickerController = {
    getStickers: asyncHandler(async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            minPrice = 0,
            maxPrice = 1000,
            q: search,
            sort,
            type,
        } = req.query as any;

        const typeFilter = (type ? [type] : ["DIGITAL", "PHYSICAL"]) as ("DIGITAL" | "PHYSICAL")[];

        const sortMap = {
            name_asc: asc(stickers.name),
            name_desc: desc(stickers.name),
            price_asc: asc(stickers.price),
            price_desc: desc(stickers.price),
            newest: desc(stickers.createdAt),
            oldest: asc(stickers.createdAt),
        };

        const orderBy = sortMap[sort as keyof typeof sortMap] || desc(stickers.createdAt);

        const filter = [
            search ? ilike(stickers.name, `%${search}%`) : undefined,
            gte(stickers.price, minPrice.toString()),
            lte(stickers.price, maxPrice.toString()),
            inArray(stickers.type, typeFilter),
        ];

        const result = await db.query.stickers.findMany({
            where: and(...filter.filter((f) => f !== undefined)),
            orderBy: orderBy,
            limit: limit,
            offset: (page - 1) * limit,
        });

        return res.json({
            success: true,
            message: "Stickers fetched successfully",
            data: result,
            pagination: { page, limit, hasMore: result.length === limit },
        });
    }),

    addSticker: asyncHandler(async (req: Request, res: Response) => {
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
        };

        const result = await db.insert(stickers).values(newSticker).returning();

        return res.json({
            success: true,
            data: result[0],
            message: "Sticker created successfully",
        });
    }),

    getStickerById: asyncHandler(async (req: Request, res: Response) => {
        return res.json({
            success: true,
            data: req.sticker,
            message: "Sticker fetched successfully",
        });
    }),

    updateSticker: asyncHandler(async (req: Request, res: Response) => {
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
        };

        const result = await db
            .update(stickers)
            .set(updateSticker)
            .where(eq(stickers.id, sticker.id))
            .returning();

        return res.json({
            success: true,
            data: result[0],
            message: "Sticker updated successfully",
        });
    }),

    deleteSticker: asyncHandler(async (req: Request, res: Response) => {
        const sticker = req.sticker;
        const result = await db.delete(stickers).where(eq(stickers.id, sticker.id)).returning();

        return res.json({
            success: true,
            data: result[0],
            message: "Sticker deleted successfully",
        });
    }),

    getStickerReviews: asyncHandler(async (req: Request, res: Response) => {
        const sticker = req.sticker;

        const result = await db.query.reviews.findMany({
            where: eq(reviews.stickerId, sticker.id),
            with: {
                user: true,
            },
        });

        return res.json({
            success: true,
            data: result,
            message: "Reviews fetched successfully",
        });
    }),
};
