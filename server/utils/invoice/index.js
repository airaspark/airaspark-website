/* ==========================================================
   AIRASPARK INDUSTRIES
   MODULAR PDF INVOICE ENGINE
========================================================== */

import PDFDocument from "pdfkit";
import QRCode from "qrcode";

import { PAGE, DEFAULT_OPTIONS, INVOICE } from "./constants.js";

import { Layout } from "./helpers.js";

import { drawHeader, drawInvoiceMeta } from "./header.js";
import { drawCustomerSection } from "./customer.js";
import { drawInvoiceTable } from "./table.js";
import { drawSummary } from "./summary.js";
import { drawPaymentDetails } from "./payment.js";
import { drawQRCodeSection } from "./qr.js";
import { drawFooter } from "./footer.js";

/* ==========================================================
   CREATE PDF BUFFER
========================================================== */

function createPDFBuffer(doc) {

  return new Promise((resolve, reject) => {

    const buffers = [];

    doc.on("data", (chunk) => {
      buffers.push(chunk);
    });

    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    doc.on("error", reject);

    doc.end();

  });

}

/* ==========================================================
   GENERATE QR BUFFER
========================================================== */

async function generateQR(invoice) {

  const verifyUrl =
    invoice.verifyUrl ||
    `${INVOICE.VERIFY_URL}?invoice=${encodeURIComponent(
      invoice.invoiceNumber || ""
    )}`;

  return QRCode.toBuffer(verifyUrl, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 256,
  });

}

/* ==========================================================
   MAIN EXPORT
========================================================== */

export async function generateInvoicePDF(
  invoice,
  options = {}
) {

  const settings = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const doc = new PDFDocument({
    size: "A4",
    margin: PAGE.MARGIN,
    bufferPages: true,
    compress: true,
  });

  const layout = new Layout();

  let qrImage = null;

  if (settings.showQRCode) {

    qrImage = await generateQR(invoice);

  }

  /* ======================================================
     PAGE CONTENT
  ====================================================== */

  drawHeader(doc, invoice);

  layout.set(PAGE.MARGIN + PAGE.HEADER_HEIGHT + 25);

  drawInvoiceMeta(doc, invoice);

  layout.move(110);

  drawCustomerSection(
    doc,
    invoice,
    layout
  );

  drawInvoiceTable(
    doc,
    invoice,
    layout
  );

  drawSummary(
    doc,
    invoice,
    layout
  );

  drawPaymentDetails(
    doc,
    invoice,
    layout
  );

  if (settings.showQRCode && qrImage) {

    drawQRCodeSection(
      doc,
      invoice,
      qrImage,
      layout
    );

  }

  if (settings.showFooter) {

    const pageNumber =
      doc.bufferedPageRange().count;

    drawFooter(
      doc,
      invoice,
      layout,
      pageNumber
    );

  }

  return createPDFBuffer(doc);

}

export default generateInvoicePDF;