import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express"
import { db } from "../db";
import { eq } from "drizzle-orm";
import { orders } from "../db/schema";

export const requireOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = getAuth(req);
        const { orderId } = req.params;
        if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
        if (!orderId) return res.status(400).json({ success: false, error: "Order ID is required" });
        const order = await db.query.orders.findFirst({
            where: eq(orders.id, orderId),
            with: {
                items: {
                    with: {
                        sticker: true
                    }
                }
            }
        });

        if (!order) return res.status(404).json({ success: false, error: "Order not found" });
        if (order.userId !== userId) return res.status(403).json({ success: false, error: "Forbidden" });
        req.order = order;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}