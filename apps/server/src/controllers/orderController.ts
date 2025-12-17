import { Request, Response } from "express";
import { db } from "../db";
import { cartItems as cartItemsTable, carts, orderItems, orders, stickers } from "../db/schema";
import { eq } from "drizzle-orm";
import { calculateCartTotal } from "../services/cartService";
import { getAuth } from "@clerk/express";
import { getOrSyncUser } from "../services/userService";

export const orderController = {
    getOrderById: async (req: Request, res: Response) => {
        try {
            const { userId } = getAuth(req);
            const { orderId } = req.params;
            console.log(userId, "----", orderId);
            if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
            if (!orderId) return res.status(400).json({ success: false, error: "Order ID is required" });
            const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId), with: { items: { with: { sticker: true } } } });
            if (!order) return res.status(404).json({ success: false, error: "Order not found" });
            if (order.userId !== userId) return res.status(403).json({ success: false, error: "Forbidden" });
            return res.status(200).json({ success: true, message: "Order found successfully", order });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    },
    createOrder: async (req: Request, res: Response) => {
        try {
            const { cartId } = req.body;
            const { userId } = getAuth(req);

            if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
            if (!cartId) return res.status(400).json({ success: false, error: "Cart ID is required" });

            await getOrSyncUser(userId);

            const cart = await db.query.carts.findFirst({ where: eq(carts.id, cartId) });
            if (!cart) return res.status(404).json({ success: false, error: "Cart not found" });

            const cartItems = await db.query.cartItems.findMany({ where: eq(cartItemsTable.cartId, cartId), with: { sticker: true } });
            if (!cartItems) return res.status(404).json({ success: false, error: "Cart items not found" });
            if (cartItems.length === 0) return res.status(404).json({ success: false, error: "Cart is empty" });
            const { totalAmount } = calculateCartTotal({ items: cartItems });


            const order = await db.transaction(async (tx) => {
                const [newOrder] = await db.insert(orders).values({ userId, totalAmount: totalAmount.toString(), status: "PENDING" }).returning();
                const newOrderItems = [];
                for (const item of cartItems) {
                    if (item.sticker.type === "PHYSICAL") {
                        if (item.quantity > item.sticker.stock) {
                            throw new Error(`Not enough stock available for ${item.sticker.name}. Only ${item.sticker.stock} left.`);
                        }
                    }
                    newOrderItems.push({
                        orderId: newOrder.id,
                        stickerId: item.stickerId,
                        price: item.sticker.price,
                        quantity: item.quantity,
                    });
                    await tx.update(stickers).set({ stock: item.sticker.stock - item.quantity }).where(eq(stickers.id, item.stickerId));
                }

                await tx.insert(orderItems).values(newOrderItems);
                await tx.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cartId));

                return await tx.query.orders.findFirst({
                    where: eq(orders.id, newOrder.id),
                    with: {
                        items: {
                            with: {
                                sticker: true
                            }
                        }
                    }
                });
            })

            return res.status(201).json({
                success: true,
                message: "Order created successfully",
                order,
            });

        } catch (error: any) {
            console.error(error);
            if (error.message.includes("Not enough stock")) {
                return res.status(400).json({ success: false, error: error.message });
            }
            return res.status(500).json({
                error: "Internal Server Error",
            });
        }
    },

    payForOrder: async (req: Request, res: Response) => {
        try {
            const { orderId } = req.params;
            const { userId } = getAuth(req);
            if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
            if (!orderId) return res.status(400).json({ success: false, error: "Order ID is required" });
            const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
            if (!order) return res.status(404).json({ success: false, error: "Order not found" });
            if (order.userId !== userId) return res.status(403).json({ success: false, error: "Forbidden" });
            if (order.status !== "PENDING") return res.status(400).json({ success: false, error: "Order is not pending" });
            await db.update(orders).set({ status: "PAID" }).where(eq(orders.id, orderId));
            return res.status(200).json({ success: true, message: "Order paid successfully" });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    },

    getAllOrders: async (req: Request, res: Response) => {
        try {
            const { userId } = getAuth(req);
            if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

            await getOrSyncUser(userId);

            const userOrders = await db.query.orders.findMany({
                where: eq(orders.userId, userId),
                orderBy: (orders, { desc }) => [desc(orders.createdAt)],
                with: {
                    items: {
                        columns: {
                            id: true
                        }
                    }
                }
            });

            return res.status(200).json({ success: true, orders: userOrders });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    }
}