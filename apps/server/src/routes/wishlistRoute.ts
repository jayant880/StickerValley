import express from "express";
import wishlistController from "../controllers/wishlistController";
import { requireWishlist } from "../middleware/wishlistMiddleware";

const router = express.Router();

router.use(requireWishlist);

router.get("/", wishlistController.getWishlist);
router.post("/", wishlistController.addWishlistItem);
router.delete("/:stickerId", wishlistController.removeWishlistItem);

export default router;
