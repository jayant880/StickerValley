import { getAuth } from "@clerk/express";
import express from "express";
import { getOrSyncUser } from "../services/userService";
import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { carts, cartItems, stickers } from "../db/schema";

export const cartController = {
    getCart: async (req: express.Request, res: express.Response) => {
        try {
            const { userId } = getAuth(req);
            if (!userId) {
                return res.status(401).json({ success: false, error: "Unauthorized" });
            }

            await getOrSyncUser(userId);

            let userCart = await db.query.carts.findFirst({
                where: eq(carts.userId, userId),
                with: {
                    items: {
                        with: {
                            sticker: true
                        }
                    }
                }
            });

            if (!userCart) {
                const [newCart] = await db.insert(carts).values({
                    userId,
                }).returning();

                return res.status(200).json({
                    success: true,
                    data: { ...newCart, items: [] }
                });
            }

            return res.status(200).json({ success: true, data: userCart });
        } catch (error) {
            console.error("Error fetching cart:", error);
            return res.status(500).json({ success: false, error: "Internal server error" });
        }
    },
    addToCart: async (req: express.Request, res: express.Response) => {
        try {
            const { userId } = getAuth(req);
            const { stickerId, quantity = 1 } = req.body;

            if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
            if (!stickerId) return res.status(400).json({ success: false, error: "Sticker ID is required" });

            await getOrSyncUser(userId);

            const sticker = await db.query.stickers.findFirst({ where: eq(stickers.id, stickerId) });

            if (!sticker) return res.status(404).json({ success: false, error: "Sticker not found" });

            let userCart = await db.query.carts.findFirst({
                where: eq(carts.userId, userId),
            });

            if (!userCart) {
                [userCart] = await db.insert(carts).values({ userId }).returning();
            }

            const existingItem = await db.query.cartItems.findFirst({
                where: and(
                    eq(cartItems.cartId, userCart.id),
                    eq(cartItems.stickerId, stickerId)
                )
            });

            if (existingItem) {
                await db.update(cartItems)
                    .set({ quantity: existingItem.quantity + quantity })
                    .where(eq(cartItems.id, existingItem.id));
            } else {
                await db.insert(cartItems).values({
                    cartId: userCart.id,
                    stickerId,
                    quantity
                });
            }

            const updatedCart = await db.query.carts.findFirst({
                where: eq(carts.userId, userId),
                with: {
                    items: {
                        with: {
                            sticker: true
                        }
                    }
                }
            });

            return res.status(200).json({ success: true, data: updatedCart });
        } catch (error) {
            console.error("Error adding to cart:", error);
            return res.status(500).json({ success: false, error: "Internal server error" });
        }
    }
}   