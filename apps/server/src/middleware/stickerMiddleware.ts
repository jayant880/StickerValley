import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { stickers, type StickerWithShopAndReviews } from "../db/schema";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export const requireSticker = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id || req.params.stickerId || req.body.stickerId;
        if (!id) throw new AppError("Sticker ID is required", 400);

        const sticker = await db.query.stickers.findFirst({
            where: eq(stickers.id, id),
            with: {
                shop: true,
                reviews: true,
            },
        });
        if (!sticker) throw new AppError("Sticker not found", 404);
        req.sticker = sticker as StickerWithShopAndReviews;
        next();
    }
);

export const requireStickerOwnership = (req: Request, res: Response, next: NextFunction) => {
    const sticker = req.sticker;
    const shop = req.shop;
    if (!sticker || !shop) throw new AppError("Missing required data for ownership check", 400);
    if (sticker.shopId !== shop.id)
        throw new AppError("Unauthorized: You do not own this sticker", 403);
    next();
};
