import express from "express";
import invoiceController from "../controllers/invoiceController";

const router = express.Router();

router.get("/:orderId", invoiceController.downloadInvoice);

export default router;