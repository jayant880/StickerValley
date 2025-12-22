import express from "express";
import { orderController } from "../controllers/orderController";
import { requireOrder } from "../middleware/orderMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { createOrderSchema } from "../validationSchema/order.schema";

const router = express.Router();

router.post("/", validate(createOrderSchema), orderController.createOrder);
router.get("/", orderController.getAllOrdersByUserId);
router.get("/:orderId", requireOrder, orderController.getOrderById);
router.put("/:orderId/pay", requireOrder, orderController.payForOrder);
router.put("/:orderId/cancel", requireOrder, orderController.cancelOrder);
router.patch("/:orderId/status", requireOrder, orderController.updateOrderStatus);

export default router;
