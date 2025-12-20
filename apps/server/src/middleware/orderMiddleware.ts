import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { orders, OrderWithItems } from "../db/schema";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export const requireOrder = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const { orderId } = req.params;
        if (!userId) throw new AppError("Unauthorized", 401);
        if (!orderId) throw new AppError("Order ID is required", 400);

        const order = await db.query.orders.findFirst({
            where: eq(orders.id, orderId),
            with: {
                items: {
                    with: {
                        sticker: true,
                    },
                },
                user: true,
            },
        });

        if (!order) throw new AppError("Order not found", 404);
        if (order.userId !== userId) throw new AppError("Forbidden", 403);
        req.order = order as OrderWithItems;
        next();
    }
);
