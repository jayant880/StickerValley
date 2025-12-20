import express from "express";
import reviewController from "../controllers/reviewController";
import { requireUser } from "../middleware/userMiddleware";
import { requireSticker } from "../middleware/stickerMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { createReviewSchema } from "../validationSchema/review.schema";

const router = express.Router();

router.post("/", requireUser, requireSticker, validate(createReviewSchema), reviewController.addReview);
router.get("/:stickerId", requireSticker, reviewController.getReviewsByStickerId);
router.get("/user/:userId", reviewController.getReviewByUserId);
router.delete("/:reviewId", requireUser, reviewController.deleteReview);

export default router;
