import { getAuth } from '@clerk/express';
import { Request, Response, NextFunction } from 'express';
import { getOrSyncUser } from '../services/userService';
import { db } from '../db';
import { carts } from '../db/schema';
import { eq } from 'drizzle-orm';

export const requireCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
        await getOrSyncUser(userId);
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

        if (!cart) {
            const [newCart] = await db.insert(carts).values({ userId }).returning();
            req.cart = { ...newCart, items: [] };
        } else {
            req.cart = cart;
        }
        next();
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
}