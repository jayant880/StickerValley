import PDFDocument from "pdfkit";
import { OrderWithItems } from "../db/schema";
import { Response } from "express";

export const invoiceService = {
    generateInvoice: (order: OrderWithItems, res: Response) => {
        const doc = new PDFDocument({ margin: 50 });

        doc.on('data', (chunk) => res.write(chunk));
        doc.on('end', () => res.end());

        generateHeader(doc);
        generateCustomerInformation(doc, order);
        generateInvoiceTable(doc, order);
        generateFooter(doc);

        doc.end();
    }
}

function generateHeader(doc: PDFKit.PDFDocument) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Sticker Valley", 50, 57)
        .fontSize(10)
        .text("Sticker Valley Inc.", 200, 50, { align: "right" })
        .text("123 Sticker Ave", 200, 65, { align: "right" })
        .text("San Francisco, CA, 94103", 200, 80, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc: PDFKit.PDFDocument, order: OrderWithItems) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(order.id.substring(0, 8), 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date(order.createdAt)), 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)
        .text(
            formatCurrency(Number(order.totalAmount)),
            150,
            customerInformationTop + 30
        );

    doc
        .font("Helvetica-Bold")
        .text("Bill To:", 300, customerInformationTop)
        .text(order.user?.name || order.user?.email || "Customer", 300, customerInformationTop + 15)
        .font("Helvetica")
        .text(order.user?.email || "", 300, customerInformationTop + 30)
        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc: PDFKit.PDFDocument, order: OrderWithItems) {
    let i = 0;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Unit Cost",
        "Quantity",
        "Line Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    for (i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.sticker.name,
            formatCurrency(Number(item.price)),
            item.quantity.toString(),
            formatCurrency(Number(item.price) * item.quantity)
        );

        generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Total",
        formatCurrency(Number(order.totalAmount))
    );
}

function generateFooter(doc: PDFKit.PDFDocument) {
    doc
        .fontSize(10)
        .text(
            "Thank you for your business.",
            50,
            700,
            { align: "center", width: 500 }
        );
}

function generateTableRow(
    doc: PDFKit.PDFDocument,
    y: number,
    item: string,
    unitCost: string,
    quantity: string,
    lineTotal: string
) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc: PDFKit.PDFDocument, y: number) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(amount: number) {
    return "$" + (amount).toFixed(2);
}

function formatDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}