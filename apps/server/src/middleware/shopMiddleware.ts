import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { shops, ShopWithStickers } from "../db/schema";

export const requireShopByShopId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { shopId } = req.params;
        if (!shopId)
            return res.status(400).json({ success: false, message: "Shop ID is required" });

        const shop = await db.query.shops.findFirst({
            where: eq(shops.id, shopId),
            with: { stickers: true, user: true },
        });
        if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });

        req.shop = shop as ShopWithStickers;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const requireShopByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const shop = await db.query.shops.findFirst({
            where: eq(shops.userId, user.id),
            with: { stickers: true, user: true },
        });
        if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });

        req.shop = shop as ShopWithStickers;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
