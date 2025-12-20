import { getAuth } from '@clerk/express';
import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { carts, CartWithItems } from '../db/schema';
import { eq } from 'drizzle-orm';

export const requireCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
        const cart = await db.query.carts.findFirst({
            where: eq(carts.userId, userId),
            with: {
                items: {
                    with: {
                        sticker: true
                    }
                }
            }
        });

        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        req.cart = cart as CartWithItems;
        next();
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
}