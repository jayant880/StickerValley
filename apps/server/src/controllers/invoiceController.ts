import { Request, Response } from "express";
import { invoiceService } from "../services/invoiceService";

const invoiceController = {
    downloadInvoice: async (req: Request, res: Response) => {
        try {
            const order = req.order;

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=invoice-${order.id}.pdf`);

            invoiceService.generateInvoice(order, res);
        } catch (error) {
            console.error(error);
            if (!res.headersSent)
                res.status(500).json({
                    success: false,
                    error: "Failed to download invoice",
                });
        }
    },
};

export default invoiceController;
