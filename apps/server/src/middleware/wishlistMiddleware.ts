import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { getOrSyncUser } from "../services/userService";
import { db } from "../db";
import { wishlists } from "../db/schema";
import { eq } from "drizzle-orm";

export const requireWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
        await getOrSyncUser(userId);
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

        if (!wishlist) {
            const [newWishlist] = await db.insert(wishlists).values({ userId }).returning();
            req.wishlist = { ...newWishlist, items: [] };
        } else {
            req.wishlist = wishlist;
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}