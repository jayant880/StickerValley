import express from "express";
import reviewController from "../controllers/reviewController";

const router = express.Router();

router.post("/", reviewController.addReview);
router.get("/:stickerId", reviewController.getReviewsByStickerId);
router.get("/user/:userId", reviewController.getReviewByUserId);
router.delete("/:reviewId", reviewController.deleteReview);

export default router;
