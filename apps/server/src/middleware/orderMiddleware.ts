import { Request, Response, NextFunction } from "express"
import { db } from "../db";
import { eq } from "drizzle-orm";
import { orders, OrderWithItems } from "../db/schema";

export const requireOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
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
                },
                user: true
            }
        });

        if (!order) return res.status(404).json({ success: false, error: "Order not found" });
        if (order.userId !== userId) return res.status(403).json({ success: false, error: "Forbidden" });
        req.order = order as OrderWithItems;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}