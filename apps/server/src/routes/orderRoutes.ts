import express from "express";
import { orderController } from "../controllers/orderController";

const router = express.Router();

router.post("/", orderController.createOrder);
router.get("/:orderId", orderController.getOrderById);

export default router;