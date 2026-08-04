/* ==========================================================
   AIRASPARK INDUSTRIES
   CUSTOMER + PROJECT SECTION
========================================================== */

import { PAGE } from "./constants.js";

import {
  drawCard,
  drawField,
  drawSectionTitle,
} from "./helpers.js";


/* ==========================================================
   CARD SETTINGS
========================================================== */

const CARD_WIDTH = 247;
const CARD_HEIGHT = 110;
const GAP = 20;

const LEFT_X = PAGE.MARGIN;
const RIGHT_X = PAGE.MARGIN + CARD_WIDTH + GAP;

/* ==========================================================
   DRAW INFORMATION SECTION
========================================================== */

export function drawCustomerSection(doc, invoice, layout) {

  const startY = layout.current();

  /* ======================================================
     CARD 1
     INVOICE DETAILS
  ====================================================== */

  drawCard(
    doc,
    LEFT_X,
    startY,
    CARD_WIDTH,
    CARD_HEIGHT
  );

  drawSectionTitle(
    doc,
    "Invoice Details",
    LEFT_X + 15,
    startY + 14
  );

  drawField(
    doc,
    "Invoice Number",
    invoice.invoiceNumber,
    LEFT_X + 15,
    startY + 40
  );

  drawField(
    doc,
    "Status",
    invoice.status || "PAID",
    LEFT_X + 135,
    startY + 40,
    90
  );

  drawField(
    doc,
    "Issue Date",
    invoice.issueDate || invoice.paymentDate,
    LEFT_X + 15,
    startY + 72
  );

  /* ======================================================
     CARD 2
     CUSTOMER
  ====================================================== */

  drawCard(
    doc,
    RIGHT_X,
    startY,
    CARD_WIDTH,
    CARD_HEIGHT
  );

  drawSectionTitle(
    doc,
    "Customer",
    RIGHT_X + 15,
    startY + 14
  );

  drawField(
    doc,
    "Name",
    invoice.customer?.name,
    RIGHT_X + 15,
    startY + 40
  );

  drawField(
    doc,
    "Customer ID",
    invoice.customer?.customerId,
    RIGHT_X + 135,
    startY + 40,
    90
  );

  drawField(
    doc,
    "Email",
    invoice.customer?.email,
    RIGHT_X + 15,
    startY + 72,
    210
  );

  layout.move(CARD_HEIGHT + 18);

  /* ======================================================
     CARD 3
     PROJECT
  ====================================================== */

  const secondRow = layout.current();

  drawCard(
    doc,
    LEFT_X,
    secondRow,
    CARD_WIDTH,
    CARD_HEIGHT
  );

  drawSectionTitle(
    doc,
    "Project",
    LEFT_X + 15,
    secondRow + 14
  );

  drawField(
    doc,
    "Project Name",
    invoice.project?.name,
    LEFT_X + 15,
    secondRow + 40
  );

  drawField(
    doc,
    "Project ID",
    invoice.project?.projectId,
    LEFT_X + 135,
    secondRow + 40,
    90
  );

  drawField(
    doc,
    "Service",
    invoice.project?.service,
    LEFT_X + 15,
    secondRow + 72
  );

  /* ======================================================
     CARD 4
     PAYMENT
  ====================================================== */

  drawCard(
    doc,
    RIGHT_X,
    secondRow,
    CARD_WIDTH,
    CARD_HEIGHT
  );

  drawSectionTitle(
    doc,
    "Payment",
    RIGHT_X + 15,
    secondRow + 14
  );

  drawField(
    doc,
    "Method",
    invoice.payment?.method,
    RIGHT_X + 15,
    secondRow + 40
  );

  drawField(
    doc,
    "Status",
    invoice.payment?.status || "Paid",
    RIGHT_X + 135,
    secondRow + 40,
    90
  );

  drawField(
    doc,
    "Payment ID",
    invoice.payment?.paymentId,
    RIGHT_X + 15,
    secondRow + 72,
    210
  );

  layout.move(CARD_HEIGHT + 30);

}