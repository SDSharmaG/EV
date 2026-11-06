const PDFDocument = require("pdfkit");
const Booking = require("../Model/Bookings");

const downloadReport = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name")
      .populate("stationId", "name")
      .populate("chargerId", "chargername");

    const doc = new PDFDocument({ margin: 30, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=admin-report.pdf"
    );

    doc.pipe(res);

    // Title
    doc.fontSize(18).text("⚡ Admin Booking Report ⚡", { align: "center" });
    doc.moveDown(1);

    const tableTop = 100;
    const colWidth = [70, 70, 70, 60, 100, 100, 50, 50]; // fixed widths
    const colX = colWidth.reduce((acc, w, i) => {
      acc.push(i === 0 ? 30 : acc[i - 1] + colWidth[i - 1]);
      return acc;
    }, []);
    const rowHeight = 20;

    const drawTableHeader = (y) => {
      doc.font("Helvetica-Bold").fontSize(10);
      const headers = [
        "User",
        "Station",
        "Charger",
        "Vehicle",
        "Start",
        "End",
        "Amount",
        "Status",
      ];
      headers.forEach((text, i) =>
        doc.text(text, colX[i], y, { width: colWidth[i], align: "left" })
      );
      doc
        .moveTo(colX[0], y + 15)
        .lineTo(580, y + 15)
        .stroke();
    };

    let y = tableTop;
    drawTableHeader(y);
    y += rowHeight;

    bookings.forEach((b, idx) => {
      // Alternating row background
      if (idx % 2 === 0) {
        doc
          .rect(30, y - 2, 550, rowHeight)
          .fill("#f0f0f0")
          .fillColor("black");
      }

      const rowData = [
        b.userId?.name || "N/A",
        b.stationId?.name || "N/A",
        b.chargerId?.chargername || "N/A",
        b.vehicleType || "N/A",
        b.startTime ? new Date(b.startTime).toLocaleString() : "N/A",
        b.endTime ? new Date(b.endTime).toLocaleString() : "N/A",
        b.totalCost != null ? `₹${b.totalCost}` : "N/A",
        b.status || "N/A",
      ];

      // Print each cell with wrapping
      let maxHeight = rowHeight;
      rowData.forEach((text, i) => {
        const cellHeight = doc.heightOfString(text, { width: colWidth[i] });
        if (cellHeight > maxHeight) maxHeight = cellHeight;
      });

      rowData.forEach((text, i) => {
        doc.text(text, colX[i], y, { width: colWidth[i], align: "left" });
      });

      y += maxHeight + 5; // spacing between rows

      // Page break
      if (y > 750) {
        doc.addPage();
        y = 50;
        drawTableHeader(y);
        y += rowHeight;
      }
    });

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ success: false, message: "Failed to generate PDF" });
  }
};

module.exports = { downloadReport };
