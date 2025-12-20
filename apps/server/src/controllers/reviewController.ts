import { Request, Response } from "express";
import { db } from "../db";
import { reviews } from "../db/schema";
import { eq } from "drizzle-orm";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

const reviewController = {
    addReview: asyncHandler(async (req: Request, res: Response) => {
        const user = req.user;
        const sticker = req.sticker;
        const { rating, comment } = req.body;
        const result = await db.insert(reviews).values({ userId: user.id, stickerId: sticker.id, rating, comment }).returning();
        return res.status(201).json({ success: true, message: "Review added successfully", data: result[0] });
    }),

    getReviewsByStickerId: asyncHandler(async (req: Request, res: Response) => {
        const sticker = req.sticker;
        const reviewsByStickerId = await db.query.reviews.findMany({ where: eq(reviews.stickerId, sticker.id), with: { user: true } });
        return res.status(200).json({ success: true, message: "Reviews fetched successfully", data: reviewsByStickerId });
    }),

    getReviewByUserId: asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const reviewsByUser = await db.query.reviews.findMany({ where: eq(reviews.userId, userId) });
        return res.status(200).json({ success: true, message: "Reviews fetched successfully", data: reviewsByUser });
    }),

    deleteReview: asyncHandler(async (req: Request, res: Response) => {
        const { reviewId } = req.params;
        const user = req.user;
        const existingReview = await db.query.reviews.findFirst({ where: eq(reviews.id, reviewId) });
        if (!existingReview) throw new AppError("Review not found", 404);
        if (existingReview.userId !== user.id) throw new AppError("Unauthorized", 401);
        const result = await db.delete(reviews).where(eq(reviews.id, reviewId)).returning();
        return res.status(200).json({ success: true, message: "Review deleted successfully", data: result[0] });
    })
}

export default reviewController;