import { getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { shops, users } from "../db/schema";

const shopController = {
    getShop: async (req: Request, res: Response) => {
        try {
            const { shopId } = req.params;

            if (!shopId) return res.status(400).json({ sucess: false, message: "Shop ID is required" });

            const shop = await db.query.shops.findFirst({ where: eq(shops.id, shopId), with: { stickers: true, user: true } });
            if (!shop) return res.status(404).json({ sucess: false, message: "Shop not found" });

            return res.status(200).json({ sucess: true, message: "Shop fetched successfully", shop });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ sucess: false, message: "Internal server error" });
        }
    },

    createShop: async (req: Request, res: Response) => {
        try {
            const { userId } = getAuth(req);
            const { name, description } = req.body;

            if (!userId) return res.status(401).json({ sucess: false, message: "Unauthorized" });
            if (!name || !description) return res.status(400).json({ sucess: false, message: "Name and description are required" });

            const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
            if (!user) return res.status(404).json({ sucess: false, message: "User not found" });

            const existingShop = await db.query.shops.findFirst({ where: eq(shops.userId, userId) });
            if (existingShop) return res.status(400).json({ sucess: false, message: "Shop already exists" });

            const shop = await db.transaction(async (tx) => {
                const [newShop] = await tx.insert(shops).values({ name, description, userId }).returning();
                await tx.update(users).set({ role: "VENDOR" }).where(eq(users.id, userId));
                return newShop;
            })

            return res.status(201).json({ sucess: true, message: "Shop created successfully", shop });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ sucess: false, message: "Internal server error" });
        }
    },

    getShopByUserId: async (req: Request, res: Response) => {
        try {
            const { userId } = getAuth(req);
            if (!userId) return res.status(401).json({ sucess: false, message: "Unauthorized" });

            const shop = await db.query.shops.findFirst({ where: eq(shops.userId, userId) });
            if (!shop) return res.status(404).json({ sucess: false, message: "Shop not found" });

            return res.status(200).json({ sucess: true, message: "Shop fetched successfully", shop });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ sucess: false, message: "Internal server error" });
        }
    },
}

export default shopController;