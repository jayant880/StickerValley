import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
import { getOrSyncUser } from "../services/userService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export const requireUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getAuth(req);
    if (!userId) throw new AppError("Unauthorized", 401);

    const user = await getOrSyncUser(userId);
    if (!user) throw new AppError("User not found", 404);

    req.user = user;
    next();
});
