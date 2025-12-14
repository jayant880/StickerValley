import { getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";

const userController = {
    me: async (req: Request, res: Response) => {
        try {
            const { userId } = getAuth(req);
            if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

            const user = await db.query.users.findFirst({
                where: eq(users.id, userId),
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

            if (!user) return res.status(404).json({ success: false, error: "User not found" });

            return res.status(200).json({ success: true, data: user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    }
}

export default userController