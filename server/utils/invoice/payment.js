/* ==========================================================
   AIRASPARK INDUSTRIES
   PAYMENT DETAILS
========================================================== */

import {
  PAGE,
  COLORS,
  FONT,
} from "./constants.js";

import {
  drawCard,
  drawSectionTitle,
  drawField,
  formatDate,
} from "./helpers.js";

/* ==========================================================
   PAYMENT DETAILS
========================================================== */

export function drawPaymentDetails(
  doc,
  invoice,
  layout
) {

  const width = PAGE.CONTENT_WIDTH;
  const height = 135;

  const x = PAGE.MARGIN;
  const y = layout.current();

  drawCard(
    doc,
    x,
    y,
    width,
    height
  );

  drawSectionTitle(
    doc,
    "Payment Information",
    x + 15,
    y + 15
  );

  /* ======================================================
     COLUMN 1
  ====================================================== */

  drawField(
    doc,
    "Payment Method",
    invoice.payment?.method || "-",
    x + 15,
    y + 42,
    150
  );

  drawField(
    doc,
    "Payment Status",
    invoice.payment?.status || "Paid",
    x + 180,
    y + 42,
    120
  );

  drawField(
    doc,
    "Payment Date",
    formatDate(
      invoice.payment?.date ||
      invoice.paymentDate
    ),
    x + 340,
    y + 42,
    150
  );

  /* ======================================================
     COLUMN 2
  ====================================================== */

  drawField(
    doc,
    "Payment ID",
    invoice.payment?.paymentId || "-",
    x + 15,
    y + 82,
    150
  );

  drawField(
    doc,
    "Order ID",
    invoice.payment?.orderId || "-",
    x + 180,
    y + 82,
    150
  );

  drawField(
    doc,
    "Transaction ID",
    invoice.payment?.transactionId || "-",
    x + 340,
    y + 82,
    150
  );

  /* ======================================================
     OPTIONAL REFERENCE
  ====================================================== */

  if (invoice.payment?.reference) {

    doc
      .font("Helvetica")
      .fontSize(FONT.SMALL)
      .fillColor(COLORS.MUTED)
      .text(
        `Reference: ${invoice.payment.reference}`,
        x + 15,
        y + 118
      );

  }

  layout.move(height + 25);

}