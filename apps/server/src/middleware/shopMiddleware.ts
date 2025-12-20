import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { shops, ShopWithStickers } from "../db/schema";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export const requireShopByShopId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { shopId } = req.params;
        if (!shopId) throw new AppError("Shop ID is required", 400);

        const shop = await db.query.shops.findFirst({
            where: eq(shops.id, shopId),
            with: { stickers: true, user: true },
        });
        if (!shop) throw new AppError("Shop not found", 404);

        req.shop = shop as ShopWithStickers;
        next();
    }
);

export const requireShopByUserId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        const shop = await db.query.shops.findFirst({
            where: eq(shops.userId, user.id),
            with: { stickers: true, user: true },
        });
        if (!shop) throw new AppError("Shop not found", 404);

        req.shop = shop as ShopWithStickers;
        next();
    }
);
