/* ==========================================================
   AIRASPARK INDUSTRIES
   SUMMARY
========================================================== */

import {
  PAGE,
  SUMMARY,
  COLORS,
  FONT,
} from "./constants.js";

import {
  drawCard,
  money,
} from "./helpers.js";

/* ==========================================================
   SUMMARY
========================================================== */

export function drawSummary(
  doc,
  invoice,
  layout
) {

  const width = SUMMARY.WIDTH;
  const height = SUMMARY.HEIGHT;

  const x =
    PAGE.WIDTH -
    PAGE.MARGIN -
    width;

  const y =
    layout.current();

  drawCard(
    doc,
    x,
    y,
    width,
    height
  );

  /* ======================================================
     TITLE
  ====================================================== */

  doc
    .font("Helvetica-Bold")
    .fontSize(FONT.SECTION)
    .fillColor(COLORS.PRIMARY)
    .text(
      "Invoice Summary",
      x + 15,
      y + 14
    );

  /* ======================================================
     VALUES
  ====================================================== */

  const rows = [

    {
      label: "Subtotal",
      value:
        invoice.calculatedSubtotal ?? 0,
    },

    {
      label: "GST",
      value:
        invoice.calculatedGST ?? 0,
    },

    {
      label: "Discount",
      value:
        invoice.calculatedDiscount ?? 0,
    },

  ];

  let rowY = y + 42;

  rows.forEach((row) => {

    doc
      .font("Helvetica")
      .fontSize(FONT.BODY)
      .fillColor(COLORS.TEXT)
      .text(
        row.label,
        x + 15,
        rowY
      );

    doc
      .font("Helvetica")
      .text(
       `Rs.${money(row.value)}`,
        x + 120,
        rowY,
        {
          width: 70,
          align: "right",
        }
      );

    rowY += 18;

  });

  /* ======================================================
     DIVIDER
  ====================================================== */

  doc
    .moveTo(
      x + 15,
      rowY + 2
    )
    .lineTo(
      x + width - 15,
      rowY + 2
    )
    .lineWidth(1)
    .strokeColor(COLORS.BORDER)
    .stroke();

  rowY += 12;

  /* ======================================================
     TOTAL BAR
  ====================================================== */

  doc
    .roundedRect(
      x + 12,
      rowY,
      width - 24,
      34,
      8
    )
    .fill(COLORS.SUCCESS);

  doc
    .fillColor(COLORS.WHITE)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(
      "TOTAL PAID",
      x + 22,
      rowY + 10
    );

  doc
    .text(
      money(
        invoice.calculatedTotal ?? 0
      ),
      x + 105,
      rowY + 10,
      {
        width: 85,
        align: "right",
      }
    );

  layout.move(
    height + 30
  );

}