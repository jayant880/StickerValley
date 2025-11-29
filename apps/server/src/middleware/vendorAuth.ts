import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { shops } from "../db/schema";

export const requireVendor = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const shop = await db.query.shops.findFirst({
        where: eq(shops.userId, userId.toString()),
    });
    if (!shop) {
        return res.status(403).json({ success: false, error: "Vendor shop required" });
    }
    req.body.shop = shop;
    next();
}
