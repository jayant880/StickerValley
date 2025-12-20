import { Request, Response } from "express";
import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { carts, cartItems } from "../db/schema";
import { calculateCartTotal } from "../services/cartService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

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
    getCart: asyncHandler(async (req: Request, res: Response) => {
        const userCart = req.cart;
        const { totalItems, totalAmount } = calculateCartTotal(userCart);
        return res.status(200).json({ success: true, message: "Cart fetched successfully", data: { ...userCart, totalItems, totalAmount } });
    }),
    addToCart: asyncHandler(async (req: Request, res: Response) => {
        const userCart = req.cart;
        const sticker = req.sticker;
        const { quantity } = req.body;

        const existingItem = await db.query.cartItems.findFirst({
            where: and(
                eq(cartItems.cartId, userCart.id),
                eq(cartItems.stickerId, sticker.id)
            )
        });

        const finalQuantity = existingItem ? existingItem.quantity + quantity : quantity;
        if (sticker.type === "PHYSICAL" && finalQuantity > sticker.stock) throw new AppError("Not enough stock available", 400);

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
            with: { items: { with: { sticker: true } } },
        });

        const { totalItems, totalAmount } = calculateCartTotal(updatedCart);
        return res.status(200).json({ success: true, message: "Item added to cart successfully", data: { ...updatedCart, totalItems, totalAmount } });
    }),
    clearCart: asyncHandler(async (req: Request, res: Response) => {
        const userCart = req.cart;
        await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id));
        return res.status(200).json({ success: true, message: "Cart cleared successfully", data: null });
    }),
    updateCartItem: asyncHandler(async (req: Request, res: Response) => {
        const userCart = req.cart;
        const sticker = req.sticker;
        const { quantity } = req.body;

        const existingItem = await db.query.cartItems.findFirst({
            where: and(
                eq(cartItems.cartId, userCart.id),
                eq(cartItems.stickerId, sticker.id)
            ),
            with: {
                sticker: true
            }
        });

        if (!existingItem) throw new AppError("Item not found in cart", 404);
        if (sticker.type === "PHYSICAL" && quantity > sticker.stock) throw new AppError("Not enough stock available", 400);

        await db.update(cartItems)
            .set({ quantity })
            .where(eq(cartItems.id, existingItem.id));

        const updatedCart = await db.query.carts.findFirst({
            where: eq(carts.id, userCart.id),
            with: { items: { with: { sticker: true } } },
        });
        if (!updatedCart) throw new AppError("Cart not found", 404);
        const { totalItems, totalAmount } = calculateCartTotal(updatedCart);
        return res.status(200).json({ success: true, message: "Cart item updated successfully", data: { ...updatedCart, totalItems, totalAmount } });
    }),
    removeCartItem: asyncHandler(async (req: Request, res: Response) => {
        const userCart = req.cart;
        const sticker = req.sticker;
        await db.delete(cartItems)
            .where(and(
                eq(cartItems.stickerId, sticker.id),
                eq(cartItems.cartId, userCart.id)
            ));

        return res.status(200).json({ success: true, message: "Item removed from cart", data: null });

    })
}   