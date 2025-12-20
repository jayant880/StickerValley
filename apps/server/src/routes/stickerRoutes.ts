import express from "express";
import { stickerController } from "../controllers/stickerController";
import { requireSticker, requireStickerOwnership } from "../middleware/stickerMiddleware";
import { requireUser } from "../middleware/userMiddleware";
import { requireShopByUserId } from "../middleware/shopMiddleware";

const router = express.Router();

router.get("/", stickerController.getStickers);
router.post("/", requireUser, requireShopByUserId, stickerController.addSticker);
router.get("/:id", requireSticker, stickerController.getStickerById);
router.put("/:id", requireUser, requireShopByUserId, requireSticker, requireStickerOwnership, stickerController.updateSticker);
router.delete("/:id", requireUser, requireShopByUserId, requireSticker, requireStickerOwnership, stickerController.deleteSticker);
router.get("/:id/reviews", requireSticker, stickerController.getStickerReviews);

export default router;