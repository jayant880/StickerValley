import express from "express";
import { cartController } from "../controllers/cartController";
import { requireCart } from "../middleware/cartMiddleware";
import { requireSticker } from "../middleware/stickerMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { addToCartSchema, updateCartItemSchema } from "../validationSchema/cart.schema";

const router = express.Router();

router.use(requireCart);

router.get("/", cartController.getCart);
router.post("/", requireSticker, validate(addToCartSchema), cartController.addToCart);
router.delete("/clear", cartController.clearCart);
router.patch(
    "/item/:stickerId",
    requireSticker,
    validate(updateCartItemSchema),
    cartController.updateCartItem
);
router.delete("/item/:stickerId", requireSticker, cartController.removeCartItem);

export default router;
