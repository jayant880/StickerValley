import express from "express";
import wishlistController from "../controllers/wishlistController";

const router = express.Router();

router.get("/", wishlistController.getWishlist);
router.post("/", wishlistController.addWishlistItem);
router.delete("/:stickerId", wishlistController.removeWishlistItem);

export default router;
