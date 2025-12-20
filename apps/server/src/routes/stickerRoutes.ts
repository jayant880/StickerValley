import express from "express";
import { stickerController } from "../controllers/stickerController";
import { requireSticker, requireStickerOwnership } from "../middleware/stickerMiddleware";
import { requireUser } from "../middleware/userMiddleware";
import { requireShopByUserId } from "../middleware/shopMiddleware";
import { validate } from "../middleware/validationMiddleware";
import {
    createStickerSchema,
    getStickersSchema,
    updateStickerSchema,
} from "../validationSchema/sticker.schema";

const router = express.Router();

router.get("/", validate(getStickersSchema), stickerController.getStickers);
router.post(
    "/",
    requireUser,
    requireShopByUserId,
    validate(createStickerSchema),
    stickerController.addSticker
);
router.get("/:id", requireSticker, stickerController.getStickerById);
router.put(
    "/:id",
    requireUser,
    requireShopByUserId,
    requireSticker,
    requireStickerOwnership,
    validate(updateStickerSchema),
    stickerController.updateSticker
);
router.delete(
    "/:id",
    requireUser,
    requireShopByUserId,
    requireSticker,
    requireStickerOwnership,
    stickerController.deleteSticker
);
router.get("/:id/reviews", requireSticker, stickerController.getStickerReviews);

export default router;
