import { Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { wishlistItems } from "../db/schema";

const wishlistController = {
    getWishlist: async (req: Request, res: Response) => {
        try {
            const userWishlist = req.wishlist
            const items = userWishlist.items.map(item => item.sticker);
            return res.status(200).json({ success: true, message: "Wishlist found successfully", items });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    addWishlistItem: async (req: Request, res: Response) => {
        try {
            const userWishlist = req.wishlist
            let wishlistId = userWishlist.id;
            const sticker = req.sticker;

            const existingItem = await db.query.wishlistItems.findFirst({
                where: (items, { and }) => and(
                    eq(items.wishlistId, wishlistId),
                    eq(items.stickerId, sticker.id)
                )
            });
            if (existingItem) return res.status(400).json({ success: false, message: "Sticker already in wishlist" });

            await db.insert(wishlistItems).values({ stickerId: sticker.id, wishlistId });
            return res.status(200).json({ success: true, message: "Sticker added to wishlist successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    removeWishlistItem: async (req: Request, res: Response) => {
        try {
            const userWishlist = req.wishlist
            const sticker = req.sticker;

            const itemToDelete = await db.query.wishlistItems.findFirst({
                where: (items, { and }) => and(
                    eq(items.wishlistId, userWishlist.id),
                    eq(items.stickerId, sticker.id)
                )
            });

            if (!itemToDelete) {
                return res.status(404).json({ success: false, message: "Wishlist item not found" });
            }

            await db.delete(wishlistItems).where(eq(wishlistItems.id, itemToDelete.id));
            return res.status(200).json({ success: true, message: "Sticker removed from wishlist successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
}

export default wishlistController;