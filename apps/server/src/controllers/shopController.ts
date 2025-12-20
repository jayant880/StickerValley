import { Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { shops, users } from "../db/schema";

const shopController = {
    getShop: async (req: Request, res: Response) => {
        try {
            return res.status(200).json({ success: true, message: "Shop fetched successfully", shop: req.shop });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    createShop: async (req: Request, res: Response) => {
        try {
            const user = req.user;
            const { name, description } = req.body;

            if (!name || !description) return res.status(400).json({ success: false, message: "Name and description are required" });

            const existingShop = await db.query.shops.findFirst({ where: eq(shops.userId, user.id) });
            if (existingShop) return res.status(400).json({ success: false, message: "Shop already exists" });

            const shop = await db.transaction(async (tx) => {
                const [newShop] = await tx.insert(shops).values({ name, description, userId: user.id }).returning();
                await tx.update(users).set({ role: "VENDOR" }).where(eq(users.id, user.id));
                return newShop;
            })

            return res.status(201).json({ success: true, message: "Shop created successfully", shop });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    getShopByUserId: async (req: Request, res: Response) => {
        try {
            return res.status(200).json({ success: true, message: "Shop fetched successfully", shop: req.shop });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
}

export default shopController;