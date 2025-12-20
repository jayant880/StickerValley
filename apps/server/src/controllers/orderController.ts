import { Request, Response } from "express";
import { db } from "../db";
import { cartItems as cartItemsTable, carts, orderItems, orders, stickers } from "../db/schema";
import { eq } from "drizzle-orm";
import { calculateCartTotal } from "../services/cartService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export const orderController = {
    getOrderById: asyncHandler(async (req: Request, res: Response) => {
        return res.status(200).json({
            success: true,
            message: "Order found successfully",
            data: req.order,
        });
    }),
    createOrder: asyncHandler(async (req: Request, res: Response) => {
        const { cartId } = req.body;
        const userId = req.user.id;

        const cart = await db.query.carts.findFirst({ where: eq(carts.id, cartId) });
        if (!cart) throw new AppError("Cart not found", 404);

        const cartItems = await db.query.cartItems.findMany({
            where: eq(cartItemsTable.cartId, cartId),
            with: { sticker: true },
        });
        if (!cartItems) throw new AppError("Cart items not found", 404);
        if (cartItems.length === 0) throw new AppError("Cart is empty", 404);

        const { totalAmount } = calculateCartTotal({ items: cartItems });

        const order = await db.transaction(async (tx) => {
            const [newOrder] = await tx
                .insert(orders)
                .values({
                    userId,
                    totalAmount: totalAmount.toString(),
                    status: "PENDING",
                })
                .returning();
            const newOrderItems = [];
            for (const item of cartItems) {
                if (item.sticker.type === "PHYSICAL") {
                    if (item.quantity > item.sticker.stock) {
                        throw new AppError(
                            `Not enough stock available for ${item.sticker.name}. Only ${item.sticker.stock} left.`,
                            400
                        );
                    }
                }
                newOrderItems.push({
                    orderId: newOrder.id,
                    stickerId: item.stickerId,
                    price: item.sticker.price,
                    quantity: item.quantity,
                });
                if (item.sticker.type === "PHYSICAL") {
                    await tx
                        .update(stickers)
                        .set({ stock: item.sticker.stock - item.quantity })
                        .where(eq(stickers.id, item.stickerId));
                }
            }

            await tx.insert(orderItems).values(newOrderItems);
            await tx.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cartId));

            return await tx.query.orders.findFirst({
                where: eq(orders.id, newOrder.id),
                with: { items: { with: { sticker: true } } },
            });
        });
        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });
    }),
    payForOrder: asyncHandler(async (req: Request, res: Response): Promise<Response> => {
        const userOrder = req.order;
        if (userOrder.status !== "PENDING") throw new AppError("Order is not pending", 400);
        await db.update(orders).set({ status: "PAID" }).where(eq(orders.id, userOrder.id));
        return res
            .status(200)
            .json({ success: true, message: "Order paid successfully", data: null });
    }),
    getAllOrdersByUserId: asyncHandler(async (req: Request, res: Response): Promise<Response> => {
        const userId = req.user.id;
        const userOrders = await db.query.orders.findMany({
            where: eq(orders.userId, userId),
            orderBy: (orders, { desc }) => [desc(orders.createdAt)],
            with: { items: { with: { sticker: true } } },
        });
        if (!userOrders) throw new AppError("Orders not found", 404);
        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: userOrders,
        });
    }),
    cancelOrder: asyncHandler(async (req: Request, res: Response): Promise<Response> => {
        const userOrder = req.order;
        if (!userOrder) throw new AppError("Order not found", 404);
        if (userOrder.status !== "PENDING") throw new AppError("Order is not pending", 400);

        await db.update(orders).set({ status: "CANCELLED" }).where(eq(orders.id, userOrder.id));
        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: null,
        });
    }),
};
