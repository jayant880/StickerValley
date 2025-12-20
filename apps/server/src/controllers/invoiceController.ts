import { Request, Response } from "express";
import { invoiceService } from "../services/invoiceService";
import { asyncHandler } from "../utils/asyncHandler";

const invoiceController = {
    downloadInvoice: asyncHandler(async (req: Request, res: Response) => {
        const order = req.order;

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=invoice-${order.id}.pdf`);

        invoiceService.generateInvoice(order, res);
    }),
};

export default invoiceController;
