import express from "express";
import { orderController } from "../controllers/orderController";

const router = express.Router();

router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/:orderId", orderController.getOrderById);
router.put("/:orderId/pay", orderController.payForOrder);

export default router;