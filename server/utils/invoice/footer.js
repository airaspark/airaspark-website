/* ==========================================================
   AIRASPARK INDUSTRIES
   FOOTER
========================================================== */

import {
  PAGE,
  FOOTER,
  COMPANY,
  COLORS,
  FONT,
} from "./constants.js";

import {
  drawDivider,
  centerText,
} from "./helpers.js";

/* ==========================================================
   FOOTER
========================================================== */

export function drawFooter(
  doc,
  invoice,
  layout,
  pageNumber = 1
) {

  const y = layout.current();

  /* ======================================================
     NOTES
  ====================================================== */

  doc
    .font("Helvetica-Bold")
    .fontSize(FONT.SECTION)
    .fillColor(COLORS.PRIMARY)
    .text(
      "Notes",
      PAGE.MARGIN,
      y
    );

  doc
    .font("Helvetica")
    .fontSize(FONT.BODY)
    .fillColor(COLORS.TEXT)
    .text(
      invoice.notes ||
      "Thank you for choosing AiraSpark Industries. We appreciate your trust and look forward to serving you again.",
      PAGE.MARGIN,
      y + 18,
      {
        width: PAGE.CONTENT_WIDTH,
      }
    );

  /* ======================================================
     TERMS
  ====================================================== */

  const termsY = y + 60;

  doc
    .font("Helvetica-Bold")
    .fontSize(FONT.SECTION)
    .fillColor(COLORS.PRIMARY)
    .text(
      "Terms & Conditions",
      PAGE.MARGIN,
      termsY
    );

  doc
    .font("Helvetica")
    .fontSize(FONT.SMALL)
    .fillColor(COLORS.MUTED)
    .text(
      invoice.terms ||
      "This invoice is generated electronically and does not require a physical signature. All payments made are subject to AiraSpark Industries' terms of service.",
      PAGE.MARGIN,
      termsY + 18,
      {
        width: PAGE.CONTENT_WIDTH,
      }
    );

  /* ======================================================
     SIGNATURE
  ====================================================== */

  const signY = termsY + 70;

  doc
    .moveTo(
      PAGE.WIDTH - 190,
      signY
    )
    .lineTo(
      PAGE.WIDTH - 60,
      signY
    )
    .strokeColor(COLORS.BORDER)
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(FONT.BODY)
    .fillColor(COLORS.TEXT)
    .text(
      "Authorized Signatory",
      PAGE.WIDTH - 190,
      signY + 8,
      {
        width: 130,
        align: "center",
      }
    );

  /* ======================================================
     SUPPORT
  ====================================================== */

  const supportY = signY + 45;

  drawDivider(
    doc,
    supportY
  );

  doc
    .font("Helvetica")
    .fontSize(FONT.SMALL)
    .fillColor(COLORS.MUTED)
    .text(
      `Support: ${COMPANY.supportEmail} | ${COMPANY.phone}`,
      PAGE.MARGIN,
      supportY + 10
    );

  centerText(
    doc,
    `${COMPANY.name} • ${COMPANY.website}`,
    supportY + 28,
    FONT.SMALL,
    COLORS.MUTED
  );

  centerText(
    doc,
    `Page ${pageNumber}`,
    PAGE.HEIGHT - 20,
    FONT.TINY,
    COLORS.MUTED
  );

  layout.move(FOOTER.HEIGHT);

}