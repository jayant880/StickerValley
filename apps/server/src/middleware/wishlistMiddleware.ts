import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { db } from "../db";
import { wishlists, WishlistWithItems } from "../db/schema";
import { eq } from "drizzle-orm";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export const requireWishlist = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = getAuth(req);
        if (!userId) throw new AppError("Unauthorized", 401);
        const wishlist = await db.query.wishlists.findFirst({
            where: eq(wishlists.userId, userId),
            with: {
                items: {
                    with: {
                        sticker: true,
                    },
                },
            },
        });

        if (!wishlist) throw new AppError("Wishlist not found", 404);

        req.wishlist = wishlist as WishlistWithItems;
        next();
    }
);
