import express from "express";
import { cartController } from "../controllers/cartController";

const router = express.Router();

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.delete("/", cartController.clearCart);
router.patch("/:stickerId", cartController.updateCartItem);
router.delete("/:stickerId", cartController.removeCartItem);

export default router;