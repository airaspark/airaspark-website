/* ==========================================================
   AIRASPARK INDUSTRIES
   PDF HELPERS
========================================================== */

import {
  PAGE,
  COLORS,
  FONT,
  INVOICE,
} from "./constants.js";

/* ==========================================================
   LAYOUT ENGINE
========================================================== */

export class Layout {

  constructor(startY = PAGE.MARGIN) {
    this.y = startY;
  }

  current() {
    return this.y;
  }

  set(y) {
    this.y = y;
  }

  move(value) {
    this.y += value;
  }

  next(height, gap = PAGE.SECTION_GAP) {
    const current = this.y;
    this.y += height + gap;
    return current;
  }

}

/* ==========================================================
   PAGE HANDLER
========================================================== */

export function ensureSpace(
  doc,
  layout,
  requiredHeight
) {

  const bottom =
    PAGE.HEIGHT -
    PAGE.MARGIN -
    PAGE.FOOTER_HEIGHT;

  if (
    layout.current() + requiredHeight >
    bottom
  ) {

    doc.addPage();

    layout.set(PAGE.MARGIN);

  }

}

/* ==========================================================
   CURRENCY FORMAT
========================================================== */
export function money(value) {

  const amount = Number(value || 0);

  return new Intl.NumberFormat(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(amount);

}

/* ==========================================================
   DATE FORMAT
========================================================== */

export function formatDate(value) {

  if (!value) return "-";

  return new Intl.DateTimeFormat(
    INVOICE.LOCALE,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(value));

}

/* ==========================================================
   DRAW CARD
========================================================== */

export function drawCard(
  doc,
  x,
  y,
  width,
  height
) {

  doc
    .save()
    .roundedRect(
      x,
      y,
      width,
      height,
      PAGE.CARD_RADIUS
    )
    .fillAndStroke(
      COLORS.WHITE,
      COLORS.BORDER
    )
    .restore();

}

/* ==========================================================
   DRAW SECTION TITLE
========================================================== */

export function drawSectionTitle(
  doc,
  title,
  x,
  y
) {

  doc
    .font("Helvetica-Bold")
    .fontSize(FONT.SECTION)
    .fillColor(COLORS.PRIMARY)
    .text(title, x, y);

}

/* ==========================================================
   DRAW LABEL + VALUE
========================================================== */

export function drawField(
  doc,
  label,
  value,
  x,
  y,
  width = 150
) {

  doc
    .font("Helvetica-Bold")
    .fontSize(FONT.SMALL)
    .fillColor(COLORS.MUTED)
    .text(
      label,
      x,
      y
    );

  doc
    .font("Helvetica")
    .fontSize(FONT.BODY)
    .fillColor(COLORS.TEXT)
    .text(
      value || "-",
      x,
      y + 14,
      {
        width,
      }
    );

}

/* ==========================================================
   DRAW DIVIDER
========================================================== */

export function drawDivider(
  doc,
  y
) {

  doc
    .moveTo(
      PAGE.MARGIN,
      y
    )
    .lineTo(
      PAGE.WIDTH -
      PAGE.MARGIN,
      y
    )
    .lineWidth(1)
    .strokeColor(
      COLORS.BORDER
    )
    .stroke();

}

/* ==========================================================
   DRAW BADGE
========================================================== */

export function drawBadge(
  doc,
  text,
  x,
  y,
  color = COLORS.SUCCESS
) {

  const width =
    Math.max(
      70,
      text.length * 8 + 24
    );

  doc
    .roundedRect(
      x,
      y,
      width,
      28,
      14
    )
    .fill(color);

  doc
    .fillColor(COLORS.WHITE)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(
      text,
      x,
      y + 8,
      {
        width,
        align: "center",
      }
    );

}

/* ==========================================================
   DRAW VALUE ROW
========================================================== */

export function drawKeyValue(
  doc,
  label,
  value,
  x,
  y,
  width = 180
) {

  doc
    .font("Helvetica")
    .fontSize(FONT.BODY)
    .fillColor(COLORS.MUTED)
    .text(
      label,
      x,
      y
    );

  doc
    .font("Helvetica-Bold")
    .fillColor(COLORS.TEXT)
    .text(
      value || "-",
      x + width,
      y,
      {
        width: 120,
        align: "right",
      }
    );

}

/* ==========================================================
   DRAW TABLE HEADER
========================================================== */

export function drawTableHeader(
  doc,
  x,
  y,
  width,
  height
) {

  doc
    .roundedRect(
      x,
      y,
      width,
      height,
      8
    )
    .fill(COLORS.PRIMARY);

}

/* ==========================================================
   CENTER TEXT
========================================================== */

export function centerText(
  doc,
  text,
  y,
  size = FONT.BODY,
  color = COLORS.TEXT
) {

  doc
    .font("Helvetica")
    .fontSize(size)
    .fillColor(color)
    .text(
      text,
      PAGE.MARGIN,
      y,
      {
        width: PAGE.CONTENT_WIDTH,
        align: "center",
      }
    );

}

/* ==========================================================
   PAGE NUMBER
========================================================== */

export function drawPageNumber(
  doc,
  page
) {

  doc
    .font("Helvetica")
    .fontSize(FONT.TINY)
    .fillColor(COLORS.MUTED)
    .text(
      `Page ${page}`,
      PAGE.MARGIN,
      PAGE.HEIGHT - 22,
      {
        width:
          PAGE.CONTENT_WIDTH,
        align: "right",
      }
    );

}