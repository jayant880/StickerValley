import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { carts, CartWithItems } from "../db/schema";
import { eq } from "drizzle-orm";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export const requireCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getAuth(req);
    if (!userId) throw new AppError("Unauthorized", 401);

    const cart = await db.query.carts.findFirst({
        where: eq(carts.userId, userId),
        with: {
            items: {
                with: {
                    sticker: true,
                },
            },
        },
    });

    if (!cart) throw new AppError("Cart not found", 404);
    req.cart = cart as CartWithItems;
    next();
});
