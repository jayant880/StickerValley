import { Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { wishlistItems } from "../db/schema";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

const wishlistController = {
    getWishlist: asyncHandler(async (req: Request, res: Response) => {
        const userWishlist = req.wishlist
        const items = userWishlist.items.map(item => item.sticker);
        return res.status(200).json({ success: true, message: "Wishlist found successfully", items });
    }),
    addWishlistItem: asyncHandler(async (req: Request, res: Response) => {
        const userWishlist = req.wishlist
        let wishlistId = userWishlist.id;
        const sticker = req.sticker;

        const existingItem = await db.query.wishlistItems.findFirst({
            where: (items, { and }) => and(
                eq(items.wishlistId, wishlistId),
                eq(items.stickerId, sticker.id)
            )
        });
        if (existingItem) throw new AppError("Sticker already in wishlist", 400);

        await db.insert(wishlistItems).values({ stickerId: sticker.id, wishlistId });
        return res.status(200).json({ success: true, message: "Sticker added to wishlist successfully" });
    }),
    removeWishlistItem: asyncHandler(async (req: Request, res: Response) => {
        const userWishlist = req.wishlist
        const sticker = req.sticker;

        const itemToDelete = await db.query.wishlistItems.findFirst({
            where: (items, { and }) => and(
                eq(items.wishlistId, userWishlist.id),
                eq(items.stickerId, sticker.id)
            )
        });

        if (!itemToDelete) throw new AppError("Wishlist item not found", 404);

        await db.delete(wishlistItems).where(eq(wishlistItems.id, itemToDelete.id));
        return res.status(200).json({ success: true, message: "Sticker removed from wishlist successfully" });
    }),
}

export default wishlistController;