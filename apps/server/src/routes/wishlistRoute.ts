import express from "express";
import wishlistController from "../controllers/wishlistController";
import { requireWishlist } from "../middleware/wishlistMiddleware";
import { requireSticker } from "../middleware/stickerMiddleware";

const router = express.Router();

router.use(requireWishlist);

router.get("/", wishlistController.getWishlist);
router.post("/", requireSticker, wishlistController.addWishlistItem);
router.delete("/:stickerId", requireSticker, wishlistController.removeWishlistItem);

export default router;
