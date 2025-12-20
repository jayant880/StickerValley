import express from "express";
import invoiceController from "../controllers/invoiceController";
import { requireUser } from "../middleware/userMiddleware";
import { requireOrder } from "../middleware/orderMiddleware";

const router = express.Router();

router.get("/:orderId", requireUser, requireOrder, invoiceController.downloadInvoice);

export default router;
