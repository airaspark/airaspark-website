/* ==========================================================
   AIRASPARK INDUSTRIES
   INVOICE PDF V4.0
   constants.js
========================================================== */

import path from "path";

/* ==========================================================
   PAGE SETTINGS
========================================================== */

export const PAGE = {
  WIDTH: 595.28, // A4 Width (PDF Points)
  HEIGHT: 841.89, // A4 Height
  MARGIN: 40,

  CONTENT_WIDTH: 515,

  HEADER_HEIGHT: 120,

  FOOTER_HEIGHT: 70,

  CARD_RADIUS: 10,

  SECTION_GAP: 18,

  ROW_HEIGHT: 32,
};

/* ==========================================================
   COLORS
========================================================== */

export const COLORS = {
  /* Brand */
  PRIMARY: "#1E40AF",
  PRIMARY_LIGHT: "#2563EB",

  /* Status */
  SUCCESS: "#16A34A",
  WARNING: "#F59E0B",
  DANGER: "#DC2626",

  /* Backgrounds */
  BACKGROUND: "#F8FAFC",
  WHITE: "#FFFFFF",

  /* Text */
  TEXT: "#111827",
  MUTED: "#6B7280",

  /* Borders */
  BORDER: "#E5E7EB",

  /* Table */
  TABLE_HEADER: "#1E40AF",

  /* Misc */
  SHADOW: "#F3F4F6",
};

/* ==========================================================
   TYPOGRAPHY
========================================================== */

export const FONT = {
  TITLE: 26,

  HEADING: 18,

  SECTION: 12,

  BODY: 10,

  SMALL: 8,

  TINY: 7,
};

/* ==========================================================
   COMPANY INFORMATION
========================================================== */

export const COMPANY = {
  name: "AiraSpark Industries",

  tagline:
    "Building Smart Solutions. Powering the Future.",

  website: "https://www.airaspark.com",

  email: "contact@airaspark.com",

  phone: "+91 9591560112",

  address: [
    "Mysuru, Karnataka",
    "India",
  ],

  gstin: "",

  cin: "",

  supportEmail: "contact@airaspark.com",
};

/* ==========================================================
   LOGO
========================================================== */



export const LOGO_PATH = path.join(
  process.cwd(),
  "server",
  "assets",
  "airaspark-logo.png"
);

/* ==========================================================
   INVOICE SETTINGS
========================================================== */

export const INVOICE = {
  TITLE: "INVOICE",

  PAID_TEXT: "PAID",

  VERIFY_URL:
    "https://airaspark.com/verify",

  CURRENCY: "INR",

  LOCALE: "en-IN",
};

/* ==========================================================
   TABLE
========================================================== */

export const TABLE = {
  COLUMNS: {
    DESCRIPTION: 260,

    QUANTITY: 45,

    PRICE: 110,

    TOTAL: 110,
  },

  HEADER_HEIGHT: 32,

  ROW_HEIGHT: 36,
};

/* ==========================================================
   SUMMARY BOX
========================================================== */

export const SUMMARY = {
  WIDTH: 220,

  HEIGHT: 110,
};

/* ==========================================================
   QR SETTINGS
========================================================== */

export const QR = {
  SIZE: 70,

  MARGIN: 1,
};

/* ==========================================================
   FOOTER
========================================================== */

export const FOOTER = {
  HEIGHT: 70,
};

/* ==========================================================
   DEFAULT OPTIONS
========================================================== */

export const DEFAULT_OPTIONS = {
  showWatermark: false,

  showPageNumber: true,

  showQRCode: true,

  showFooter: true,

  showCompanyLogo: true,
};