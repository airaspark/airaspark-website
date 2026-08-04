/* ==========================================================
   AIRASPARK INDUSTRIES
   INVOICE TABLE
========================================================== */

import {
  PAGE,
  TABLE,
  COLORS,
  FONT,
} from "./constants.js";

import {
  money,
  ensureSpace,
} from "./helpers.js";

/* ==========================================================
   DRAW TABLE
========================================================== */

export function drawInvoiceTable(
  doc,
  invoice,
  layout
) {

  const items =
    invoice.items?.length
      ? invoice.items
      : [
          {
            description:
              invoice.project?.name ||
              "Software Development Service",

            quantity: 1,

            unitPrice:
              invoice.amount || 0,

            total:
              invoice.amount || 0,
          },
        ];

  ensureSpace(
    doc,
    layout,
    180
  );

  const startY =
    layout.current();

  const tableWidth =
    PAGE.CONTENT_WIDTH;

  /* ======================================================
     HEADER
  ====================================================== */

  doc
    .roundedRect(
      PAGE.MARGIN,
      startY,
      tableWidth,
      TABLE.HEADER_HEIGHT,
      8
    )
    .fill(COLORS.PRIMARY);

  doc
    .fillColor(COLORS.WHITE)
    .font("Helvetica-Bold")
    .fontSize(FONT.BODY);

  const x = PAGE.MARGIN;

  doc.text(
    "Description",
    x + 15,
    startY + 10,
    {
      width:
        TABLE.COLUMNS.DESCRIPTION,
    }
  );

  doc.text(
    "Qty",
    x + 285,
    startY + 10,
    {
      width:
        TABLE.COLUMNS.QUANTITY,
      align: "center",
    }
  );

  doc.text(
    "Price",
    x + 340,
    startY + 10,
    {
      width:
        TABLE.COLUMNS.PRICE,
      align: "right",
    }
  );

  doc.text(
    "Amount",
    x + 435,
    startY + 10,
    {
      width:
        TABLE.COLUMNS.TOTAL,
      align: "right",
    }
  );

  layout.move(TABLE.HEADER_HEIGHT);

  /* ======================================================
     ROWS
  ====================================================== */

  let subtotal = 0;

  items.forEach((item) => {

    ensureSpace(
      doc,
      layout,
      TABLE.ROW_HEIGHT + 12
    );

    const rowY =
      layout.current();

    subtotal +=
      Number(
        item.total ??
        item.amount ??
        0
      );

    doc
      .roundedRect(
        PAGE.MARGIN,
        rowY,
        tableWidth,
        TABLE.ROW_HEIGHT,
        6
      )
      .fillAndStroke(
        COLORS.WHITE,
        COLORS.BORDER
      );

    doc
      .fillColor(COLORS.TEXT)
      .font("Helvetica-Bold")
      .fontSize(FONT.BODY)
      .text(
        item.description,
        x + 15,
        rowY + 8,
        {
          width:
            TABLE.COLUMNS.DESCRIPTION,
        }
      );

    doc
      .font("Helvetica")
      .fontSize(FONT.SMALL)
      .fillColor(COLORS.MUTED)
      .text(
        item.notes || "",
        x + 15,
        rowY + 22,
        {
          width: 220,
        }
      );

    doc
      .font("Helvetica")
      .fontSize(FONT.BODY)
      .fillColor(COLORS.TEXT);

    doc.text(
      String(
        item.quantity || 1
      ),
      x + 290,
      rowY + 12,
      {
        width:
          TABLE.COLUMNS.QUANTITY,
        align: "center",
      }
    );

    doc.text(
      `Rs.${money(
  item.unitPrice ??
  item.price ??
  item.amount
)}`,
      x + 315,
      rowY + 12,
      {
        width:
          110,
        align: "right",
      }
    );

    doc.text(
  `Rs.${money(
    item.total ??
    item.amount
  )}`,
  x + 410,
  rowY + 12,
  {
    width: 105,
    align: "right",
  }
);

    layout.move(
      TABLE.ROW_HEIGHT + 10
    );

  });

  /* ======================================================
     SAVE TOTALS
  ====================================================== */

  invoice.calculatedSubtotal =
    subtotal;

  invoice.calculatedGST =
    invoice.gst ?? 0;

  invoice.calculatedDiscount =
    invoice.discount ?? 0;

  invoice.calculatedTotal =
    subtotal +
    invoice.calculatedGST -
    invoice.calculatedDiscount;

}