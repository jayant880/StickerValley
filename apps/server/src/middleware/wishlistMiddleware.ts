import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { db } from "../db";
import { wishlists, WishlistWithItems } from "../db/schema";
import { eq } from "drizzle-orm";

export const requireWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
        const wishlist = await db.query.wishlists.findFirst({
            where: eq(wishlists.userId, userId),
            with: {
                items: {
                    with: {
                        sticker: true
                    }
                }
            }
        });

        if (!wishlist) return res.status(404).json({ success: false, message: "Wishlist not found" });

        req.wishlist = wishlist as WishlistWithItems;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}