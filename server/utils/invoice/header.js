/* ==========================================================
   AIRASPARK INDUSTRIES
   HEADER
========================================================== */

import fs from "fs";

import {
  PAGE,
  COLORS,
  FONT,
  COMPANY,
  LOGO_PATH,
  INVOICE,
} from "./constants.js";

import {
  formatDate,
  drawDivider,
  drawBadge,
} from "./helpers.js";

/* ==========================================================
   HEADER
========================================================== */

export function drawHeader(doc, invoice) {

  const top = PAGE.MARGIN;

  /* ======================================================
     HEADER BACKGROUND
  ====================================================== */

  doc
    .roundedRect(
      PAGE.MARGIN,
      top,
      PAGE.CONTENT_WIDTH,
      PAGE.HEADER_HEIGHT,
      12
    )
    .fill(COLORS.PRIMARY);

  /* ======================================================
     LOGO
  ====================================================== */
 console.log("LOGO_PATH:", LOGO_PATH);
console.log("Exists:", fs.existsSync(LOGO_PATH));

try {

  doc.image(
    LOGO_PATH,
    PAGE.MARGIN + 20,
    top + 15,
    {
      width: 60,
    }
  );

  console.log("✅ Logo rendered");

} catch (err) {

  console.error("❌ Logo error:", err);

}

  /* ======================================================
     COMPANY NAME
  ====================================================== */

  const companyX = 135;

  doc
    .fillColor(COLORS.WHITE)
    .font("Helvetica-Bold")
    .fontSize(18)
    .text(
      COMPANY.name,
      companyX,
      top + 18
    );

  doc
    .font("Helvetica")
    .fontSize(9)
    .text(
      COMPANY.tagline,
      companyX,
      top + 42,
      {
        width: 200,
      }
    );

  doc
    .text(
      COMPANY.website,
      companyX,
      top + 60
    );

  doc
    .text(
      COMPANY.email,
      companyX,
      top + 74
    );

  doc
    .text(
      COMPANY.phone,
      companyX,
      top + 88
    );

  /* ======================================================
     INVOICE TITLE
  ====================================================== */

  doc
    .font("Helvetica-Bold")
    .fontSize(FONT.TITLE)
    .fillColor(COLORS.WHITE)
    .text(
      INVOICE.TITLE,
      350,
      top + 16,
      {
        width: 170,
        align: "right",
      }
    );

  /* ======================================================
     PAID BADGE
  ====================================================== */

  drawBadge(
    doc,
    INVOICE.PAID_TEXT,
    430,
    top + 65,
    COLORS.SUCCESS
  );

  /* ======================================================
     DIVIDER
  ====================================================== */

  drawDivider(
    doc,
    top + PAGE.HEADER_HEIGHT + 12
  );

}

/* ==========================================================
   INVOICE META
========================================================== */

export function drawInvoiceMeta(doc, invoice) {

  const y = PAGE.MARGIN + PAGE.HEADER_HEIGHT + 28;

  doc
    .font("Helvetica-Bold")
    .fontSize(FONT.SECTION)
    .fillColor(COLORS.PRIMARY)
    .text(
      "Invoice Information",
      PAGE.MARGIN,
      y
    );

  const labelX = PAGE.MARGIN;
  const valueX = 170;

  const startY = y + 24;

  const rows = [

    [
      "Invoice Number",
      invoice.invoiceNumber || "-"
    ],

    [
      "Issue Date",
      formatDate(
        invoice.issueDate ||
        invoice.paymentDate
      )
    ],

    [
      "Payment Date",
      formatDate(
        invoice.paymentDate
      )
    ],

    [
      "Status",
      invoice.status || "PAID"
    ]

  ];

  rows.forEach((row, index) => {

    const rowY =
      startY + (index * 20);

    doc
      .font("Helvetica")
      .fontSize(FONT.BODY)
      .fillColor(COLORS.MUTED)
      .text(
        row[0],
        labelX,
        rowY
      );

    doc
      .font("Helvetica-Bold")
      .fillColor(COLORS.TEXT)
      .text(
        row[1],
        valueX,
        rowY
      );

  });

}