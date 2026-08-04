/* ==========================================================
   AIRASPARK INDUSTRIES
   QR SECTION
========================================================== */

import {
  PAGE,
  QR,
  COMPANY,
  INVOICE,
  COLORS,
  FONT,
} from "./constants.js";

import {
  drawCard,
  drawSectionTitle,
} from "./helpers.js";

/* ==========================================================
   QR SECTION
========================================================== */

export function drawQRCodeSection(
  doc,
  invoice,
  qrImage,
  layout
) {

  if (!qrImage) {
    return;
  }

  const width = PAGE.CONTENT_WIDTH;
  const height = 120;

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
    "Invoice Verification",
    x + 15,
    y + 15
  );

  /* ======================================================
     QR IMAGE
  ====================================================== */

  doc.image(
    qrImage,
    x + 20,
    y + 35,
    {
      width: QR.SIZE,
      height: QR.SIZE,
    }
  );

  /* ======================================================
     TEXT
  ====================================================== */

  doc
    .font("Helvetica-Bold")
    .fontSize(FONT.BODY)
    .fillColor(COLORS.TEXT)
    .text(
      "Scan to verify this invoice",
      x + 110,
      y + 42
    );

  doc
    .font("Helvetica")
    .fontSize(FONT.SMALL)
    .fillColor(COLORS.MUTED)
    .text(
      "Verify the authenticity of this invoice using the official AiraSpark verification portal.",
      x + 110,
      y + 60,
      {
        width: 280,
      }
    );

  /* ======================================================
     VERIFICATION URL
  ====================================================== */

  const verifyUrl =
    invoice.verifyUrl ||
    `${INVOICE.VERIFY_URL}?invoice=${encodeURIComponent(
      invoice.invoiceNumber || ""
    )}`;

  doc
    .fillColor(COLORS.PRIMARY)
    .font("Helvetica")
    .fontSize(FONT.SMALL)
    .text(
      verifyUrl,
      x + 110,
      y + 95,
      {
        width: 320,
      }
    );

  /* ======================================================
     COMPANY
  ====================================================== */

  doc
    .fillColor(COLORS.MUTED)
    .fontSize(FONT.TINY)
    .text(
      `${COMPANY.name} • ${COMPANY.website}`,
      x + 110,
      y + 108
    );

  layout.move(height + 25);

}