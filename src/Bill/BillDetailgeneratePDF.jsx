import jsPDF from "jspdf";
import "jspdf-autotable";

const BillDetailgeneratePDF = (saleData) => {

    console.log("saleDate", saleData);

    const doc = new jsPDF();
    const currentDate = new Date(saleData.sale.date).toLocaleDateString("en-GB");


    doc.text(`Bill ID: ${saleData.sale.sale_id}`, 10, 10);
    doc.text(`Date: ${currentDate}`, 150, 10);

    const tableColumn = ["itemCode", "BarCode", "Name", "Qty", "Price", "Total"];
    const tableRows = [];

    saleData.items.forEach((saleData) => {
        const rowData = [
            saleData.item_code,
            saleData.barcode,
            saleData.name,
            saleData.quantity,
            `${saleData.price} Kyats`,
            `${saleData.price * saleData.quantity} Kyats`,
        ];
        tableRows.push(rowData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
    });

    const finalY = (doc.autoTable.previous ? doc.autoTable.previous.finalY : 40) + 30;

    const formatAmount = (amount) => `${parseFloat(amount).toFixed(2)} Kyats`;

    doc.setFont("helvetica", "bold");
    doc.text("Summary", 10, finalY);
    doc.setFont("helvetica", "normal");

    doc.text(`Subtotal: ` + formatAmount(saleData.sale.subtotal || 0), 10, finalY + 10);
    doc.text(`Discount: ` + formatAmount(saleData.sale.discount || 0), 10, finalY + 20);
    doc.text(`Cashback: ` + formatAmount(saleData.sale.cashBack || 0), 10, finalY + 30);
    doc.text(`Total: ` + formatAmount(saleData.sale.total || 0), 10, finalY + 40);
    doc.text(`Amount Paid: ` + formatAmount(saleData.sale.amountPaid || 0), 10, finalY + 50);
    doc.text(`Remaining Balance: ` + formatAmount(saleData.sale.remainingBalance || 0), 10, finalY + 60);

    doc.save(`bill-receipt-${saleData.sale.sale_id}.pdf`);
}

export default BillDetailgeneratePDF