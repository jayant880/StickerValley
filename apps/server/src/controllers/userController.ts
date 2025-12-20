import { Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

const userController = {
    me: asyncHandler(async (req: Request, res: Response) => {
        const user = req.user;
        const fullUser = await db.query.users.findFirst({
            where: eq(users.id, user.id),
            with: {
                shop: { with: { stickers: true } },
                orders: { with: { items: { with: { sticker: true } } } },
                cart: true,
                reviews: true
            }
        });

        if (!fullUser) throw new AppError("User Not Found", 404);
        return res.status(200).json({ success: true, message: "User fetched successfully", data: fullUser });

    }),

    getUserById: asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                shop: { with: { stickers: true } },
                orders: { with: { items: { with: { sticker: true } } } },
                reviews: { with: { sticker: true } }
            }
        });

        if (!user) throw new AppError("User Not Found", 404);
        return res.status(200).json({ success: true, message: "User fetched successfully", data: user });
    }),

    updateMe: asyncHandler(async (req: Request, res: Response) => {
        const user = req.user;
        const { name } = req.body;

        const updatedUser = await db.update(users)
            .set({ name: name.trim() })
            .where(eq(users.id, user.id))
            .returning();

        return res.status(200).json({ success: true, data: updatedUser[0] });
    }),
}

export default userController