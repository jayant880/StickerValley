import { Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { shops, users } from "../db/schema";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

const shopController = {
    getShop: asyncHandler(async (req: Request, res: Response) => {
        return res.status(200).json({ success: true, message: "Shop fetched successfully", data: req.shop });
    }),

    createShop: asyncHandler(async (req: Request, res: Response) => {
        const user = req.user;
        const { name, description } = req.body;

        const existingShop = await db.query.shops.findFirst({ where: eq(shops.userId, user.id) });
        if (existingShop) throw new AppError("Shop Already Exist", 400);

        const shop = await db.transaction(async (tx) => {
            const [newShop] = await tx.insert(shops).values({ name, description, userId: user.id }).returning();
            await tx.update(users).set({ role: "VENDOR" }).where(eq(users.id, user.id));
            return newShop;
        })

        return res.status(201).json({ success: true, message: "Shop created successfully", data: shop });
    }),

    getShopByUserId: asyncHandler(async (req: Request, res: Response) => {
        return res.status(200).json({ success: true, message: "Shop fetched successfully", data: req.shop })
    }),

    updateShop: asyncHandler(async (req: Request, res: Response) => {
        const shop = req.shop;
        const { name, description } = req.body;
        const updatedShop = await db.update(shops).set({ name, description }).where(eq(shops.id, shop.id)).returning();
        if (!updatedShop[0]) throw new AppError("Shop Not Found", 404);
        return res.status(200).json({ success: true, message: "Shop updated successfully", data: updatedShop[0] });
    }),
}

export default shopController;