import { Request, Response } from "express";
import { db } from "../db";
import { orders } from "../db/schema";
import { eq } from "drizzle-orm";
import { invoiceService } from "../services/invoiceService";
import { getAuth } from "@clerk/express";

const invoiceController = {
    downloadInvoice: async (req: Request, res: Response) => {
        try {
            const { userId } = getAuth(req);
            const { orderId } = req.params;

            if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

            const order = await db.query.orders.findFirst({
                where: eq(orders.id, orderId),
                with: {
                    items: {
                        with: {
                            sticker: true
                        }
                    },
                    user: true
                }
            });

            if (!order) return res.status(404).json({ success: false, error: "Order not found" });
            if (order.userId !== userId) return res.status(403).json({ success: false, error: "Forbidden" });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);

            invoiceService.generateInvoice(order, res);

        } catch (error) {
            console.error(error);
            if (!res.headersSent) res.status(500).json({ success: false, error: "Failed to download invoice" });
        }
    }
}

export default invoiceController;
