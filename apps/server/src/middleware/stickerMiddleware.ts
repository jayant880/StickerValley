import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { stickers, type StickerWithShopAndReviews } from "../db/schema";

export const requireSticker = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id || req.params.stickerId || req.body.stickerId;
        if (!id) return res.status(400).json({ success: false, error: "Sticker ID is required" });

        const sticker = await db.query.stickers.findFirst({
            where: eq(stickers.id, id),
            with: {
                shop: true,
                reviews: true,
            },
        });
        if (!sticker) return res.status(404).json({ success: false, error: "Sticker not found" });
        req.sticker = sticker as StickerWithShopAndReviews;
        next();
    } catch (error) {
        console.error("Error while fetching sticker", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const requireStickerOwnership = (req: Request, res: Response, next: NextFunction) => {
    try {
        const sticker = req.sticker;
        const shop = req.shop;
        if (!sticker || !shop)
            return res.status(400).json({
                success: false,
                error: "Missing required data for ownership check",
            });
        if (sticker.shopId !== shop.id)
            return res.status(403).json({
                success: false,
                error: "Unauthorized: You do not own this sticker",
            });
        next();
    } catch (error) {
        console.error("Error while checking sticker ownership", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};
