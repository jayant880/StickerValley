import { Request, Response } from "express";
import { db } from "../db";
import { reviews } from "../db/schema";
import { eq } from "drizzle-orm";

const reviewController = {
    addReview: async (req: Request, res: Response): Promise<Response<{ success: boolean; message: string; review?: typeof reviews.$inferSelect }>> => {
        try {
            const user = req.user;
            const sticker = req.sticker;
            const { rating, comment } = req.body;

            const result = await db.insert(reviews).values({ userId: user.id, stickerId: sticker.id, rating, comment }).returning();
            return res.status(201).json({ success: true, message: "Review added successfully", review: result[0] });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    getReviewsByStickerId: async (req: Request, res: Response) => {
        try {
            const sticker = req.sticker;

            const reviewsByStickerId = await db.query.reviews.findMany({ where: eq(reviews.stickerId, sticker.id), with: { user: true } });
            return res.status(200).json({ success: true, message: "Reviews fetched successfully", reviewsByStickerId });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    getReviewByUserId: async (req: Request, res: Response): Promise<Response<{ success: boolean; message: string; reviewsByUser?: typeof reviews.$inferSelect[] }>> => {
        try {
            const { userId } = req.params;
            const reviewsByUser = await db.query.reviews.findMany({ where: eq(reviews.userId, userId) });
            return res.status(200).json({ success: true, message: "Reviews fetched successfully", reviewsByUser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    deleteReview: async (req: Request, res: Response): Promise<Response<{ success: boolean; message: string; review?: typeof reviews.$inferSelect }>> => {
        try {
            const { reviewId } = req.params;
            const user = req.user;
            const existingReview = await db.query.reviews.findFirst({ where: eq(reviews.id, reviewId) });
            if (!existingReview) return res.status(404).json({ success: false, message: "Review not found" });
            if (existingReview.userId !== user.id) return res.status(401).json({ success: false, message: "Unauthorized" });
            const result = await db.delete(reviews).where(eq(reviews.id, reviewId)).returning();
            return res.status(200).json({ success: true, message: "Review deleted successfully", review: result[0] });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

export default reviewController;