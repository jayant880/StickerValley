import express from "express";
import { requireVendor } from "../middleware/vendorAuth";
import { stickerController } from "../controllers/stickerController";

const router = express.Router();

router.get("/", stickerController.getStickers);
router.post("/", requireVendor, stickerController.addSticker);
router.get("/:id", stickerController.getStickerById);
router.put("/:id", requireVendor, stickerController.updateSticker);
router.delete("/:id", requireVendor, stickerController.deleteSticker);

export default router;