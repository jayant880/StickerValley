import { getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";

const userController = {
    me: async (req: Request, res: Response) => {
        try {
            const user = req.user;
            const fullUser = await db.query.users.findFirst({
                where: eq(users.id, user.id),
                with: {
                    shop:
                    {
                        with: { stickers: true }
                    },
                    orders:
                    {
                        with: { items: { with: { sticker: true } } }
                    },
                    cart: true,
                    reviews: true
                }
            });

            if (!fullUser) return res.status(404).json({ success: false, error: "User not found" });

            return res.status(200).json({ success: true, data: fullUser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    },

    getUserById: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const user = await db.query.users.findFirst({
                where: eq(users.id, userId),
                with: {
                    shop: { with: { stickers: true } },
                    orders: { with: { items: { with: { sticker: true } } } },
                    reviews: { with: { sticker: true } }
                }
            });

            if (!user) return res.status(404).json({ success: false, error: "User not found" });

            return res.status(200).json({ success: true, data: user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    },

    updateMe: async (req: Request, res: Response) => {
        try {
            const user = req.user;
            const { name } = req.body;
            if (!name || !name.trim() || name.length < 3) {
                return res.status(400).json({ success: false, error: "Name must be at least 3 characters" });
            }

            const updatedUser = await db.update(users)
                .set({ name: name.trim() })
                .where(eq(users.id, user.id))
                .returning();

            return res.status(200).json({ success: true, data: updatedUser[0] });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    }
}

export default userController