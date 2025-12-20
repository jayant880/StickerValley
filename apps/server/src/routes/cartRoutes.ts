import express from "express";
import { cartController } from "../controllers/cartController";
import { requireCart } from "../middleware/cartMiddleware";
import { requireSticker } from "../middleware/stickerMiddleware";

const router = express.Router();

router.use(requireCart);

router.get("/", cartController.getCart);
router.post("/", requireSticker, cartController.addToCart);
router.delete("/clear", cartController.clearCart);
router.patch("/item/:stickerId", requireSticker, cartController.updateCartItem);
router.delete("/item/:stickerId", requireSticker, cartController.removeCartItem);

export default router;