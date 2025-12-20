import { Request, Response } from "express";
import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { carts, cartItems, stickers } from "../db/schema";
import { calculateCartTotal } from "../services/cartService";

/**
 * Cart controller - Handles shopping cart operations for users
 * 
 * @namespace cartController
 * @description Provides methods for managing user's shopping cart
 * 
 * @method getCart - Get user's cart
 * @method addToCart - Add a sticker to the cart
 * @method clearCart - Clear the user's cart
 * @method updateCartItem - Update the quantity of a cart item
 * @method removeCartItem - Remove a cart item
 */
export const cartController = {
    getCart: async (req: Request, res: Response) => {
        try {
            const userCart = req.cart;
            const { totalItems, totalAmount } = calculateCartTotal(userCart);
            return res.status(200).json({ success: true, data: { ...userCart, totalItems, totalAmount } });
        } catch (error) {
            console.error("Error fetching cart:", error);
            return res.status(500).json({ success: false, error: "Internal server error" });
        }
    },
    addToCart: async (req: Request, res: Response) => {
        try {
            const userCart = req.cart;
            const sticker = req.sticker;
            const quantity = Math.max(1, Number(req.body.quantity) || 1);

            const existingItem = await db.query.cartItems.findFirst({
                where: and(
                    eq(cartItems.cartId, userCart.id),
                    eq(cartItems.stickerId, sticker.id)
                )
            });

            const finalQuantity = existingItem ? existingItem.quantity + quantity : quantity;

            if (sticker.type === "PHYSICAL") {
                if (finalQuantity > sticker.stock) {
                    return res.status(400).json({
                        success: false,
                        error: `Not enough stock available. Only ${sticker.stock} left.`
                    });
                }
            }

            if (existingItem) {
                await db.update(cartItems)
                    .set({ quantity: finalQuantity })
                    .where(eq(cartItems.id, existingItem.id));
            } else {
                await db.insert(cartItems).values({
                    cartId: userCart.id,
                    stickerId: sticker.id,
                    quantity
                });
            }

            const updatedCart = await db.query.carts.findFirst({
                where: eq(carts.id, userCart.id),
                with: {
                    items: {
                        with: {
                            sticker: true
                        }
                    }
                },
            });

            const { totalItems, totalAmount } = calculateCartTotal(updatedCart);
            return res.status(200).json({ success: true, data: { ...updatedCart, totalItems, totalAmount } });
        } catch (error) {
            console.error("Error adding to cart:", error);
            return res.status(500).json({ success: false, error: "Internal server error" });
        }
    },
    clearCart: async (req: Request, res: Response) => {
        try {
            const userCart = req.cart;
            await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id));
            return res.status(200).json({ success: true, message: "Cart cleared successfully" });
        } catch (error) {
            console.error("Error clearing cart:", error);
            return res.status(500).json({ success: false, error: "Internal server error" });
        }
    },
    updateCartItem: async (req: Request, res: Response) => {
        try {
            const userCart = req.cart;
            const sticker = req.sticker;
            const quantity = Number(req.body.quantity);

            if (!quantity || quantity < 1) return res.status(400).json({ success: false, error: "Quantity must be at least 1" });

            const existingItem = await db.query.cartItems.findFirst({
                where: and(
                    eq(cartItems.cartId, userCart.id),
                    eq(cartItems.stickerId, sticker.id)
                ),
                with: {
                    sticker: true
                }
            });

            if (!existingItem) return res.status(404).json({ success: false, error: "Item not found in cart" });

            if (sticker.type === "PHYSICAL") {
                if (quantity > sticker.stock) {
                    return res.status(400).json({
                        success: false,
                        error: `Not enough stock available. Only ${sticker.stock} left.`
                    });
                }
            }

            await db.update(cartItems)
                .set({ quantity })
                .where(eq(cartItems.id, existingItem.id));

            const updatedCart = await db.query.carts.findFirst({
                where: eq(carts.id, userCart.id),
                with: {
                    items: {
                        with: {
                            sticker: true
                        }
                    }
                }
            });

            const { totalItems, totalAmount } = calculateCartTotal(updatedCart);
            return res.status(200).json({ success: true, data: { ...updatedCart, totalItems, totalAmount } });
        } catch (error) {
            console.error("Error updating cart item:", error);
            return res.status(500).json({ success: false, error: "Internal server error" });
        }
    },
    removeCartItem: async (req: Request, res: Response) => {
        try {
            const userCart = req.cart;
            const sticker = req.sticker;

            await db.delete(cartItems)
                .where(and(
                    eq(cartItems.stickerId, sticker.id),
                    eq(cartItems.cartId, userCart.id)
                ));

            return res.status(200).json({ success: true, message: "Item removed from cart" });
        } catch (error) {
            console.error("Error removing from cart:", error);
            return res.status(500).json({ success: false, error: "Internal server error" });
        }
    }
}   