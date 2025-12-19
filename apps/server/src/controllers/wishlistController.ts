import { getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { stickers, users, wishlistItems, wishlists } from "../db/schema";

const wishlistController = {
    getWishlist: async (req: Request, res: Response) => {
        try {
            const { userId } = getAuth(req);
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const user = await db.query.users.findFirst({
                where: eq(users.id, userId),
                with: { wishlist: { with: { items: { with: { sticker: true } } } } }
            });

            if (!user) return res.status(404).json({ success: false, message: "User not found" });
            if (!user.wishlist) {
                const [newWishlist] = await db.insert(wishlists).values({ userId }).returning();
                return res.status(200).json({ success: true, message: "Wishlist created successfully", items: [] });
            }

            const items = user.wishlist.items.map(item => item.sticker);
            return res.status(200).json({ success: true, message: "Wishlist found successfully", items });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    addWishlistItem: async (req: Request, res: Response) => {
        try {
            const { userId } = getAuth(req);
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            let user = await db.query.users.findFirst({
                where: eq(users.id, userId),
                with: { wishlist: true }
            });

            if (!user) return res.status(404).json({ success: false, message: "User not found" });

            let wishlistId = user.wishlist?.id;

            if (!wishlistId) {
                const [newWishlist] = await db.insert(wishlists).values({ userId }).returning();
                wishlistId = newWishlist.id;
            }

            const { stickerId } = req.body;
            if (!stickerId) return res.status(400).json({ success: false, message: "Sticker ID is required" });

            const sticker = await db.query.stickers.findFirst({ where: eq(stickers.id, stickerId) });
            if (!sticker) return res.status(404).json({ success: false, message: "Sticker not found" });
            const existingItem = await db.query.wishlistItems.findFirst({
                where: (items, { and }) => and(
                    eq(items.wishlistId, wishlistId),
                    eq(items.stickerId, stickerId)
                )
            });
            if (existingItem) return res.status(400).json({ success: false, message: "Sticker already in wishlist" });

            await db.insert(wishlistItems).values({ stickerId, wishlistId });
            return res.status(200).json({ success: true, message: "Sticker added to wishlist successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    removeWishlistItem: async (req: Request, res: Response) => {
        try {
            const { userId } = getAuth(req);
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const user = await db.query.users.findFirst({
                where: eq(users.id, userId),
                with: { wishlist: true }
            });

            if (!user || !user.wishlist) {
                return res.status(404).json({ success: false, message: "Wishlist not found" });
            }

            const { stickerId } = req.params;
            if (!stickerId) return res.status(400).json({ success: false, message: "Sticker ID is required" });

            const itemToDelete = await db.query.wishlistItems.findFirst({
                where: (items, { and }) => and(
                    eq(items.wishlistId, user.wishlist!.id),
                    eq(items.stickerId, stickerId)
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