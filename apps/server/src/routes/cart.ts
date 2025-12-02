import express from "express";
import { cartController } from "../controllers/cartController";

const router = express.Router();

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.delete("/:stickerId", cartController.removeCartItem);

export default router;