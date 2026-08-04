import admin from "../firebaseAdmin.js";

const db = admin.firestore();

export async function getCustomerReceipts(firebaseUid, search = "") {
  // Find customer
  const customerSnapshot = await db
    .collection("customers")
    .where("firebaseUid", "==", firebaseUid)
    .limit(1)
    .get();

  if (customerSnapshot.empty) {
    throw new Error("Customer not found.");
  }

  const customer = customerSnapshot.docs[0].data();

  let query = db
    .collection("receipts")
    .where("customerId", "==", customer.customerId);

  const snapshot = await query.get();

  let receipts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (search) {
    const keyword = search.toLowerCase();

    receipts = receipts.filter((receipt) =>
      [
        receipt.receiptNumber,
        receipt.invoiceNumber,
        receipt.customerName,
        receipt.projectName,
        receipt.paymentMethod,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }

  receipts.sort((a, b) => {
    const first =
      a.paymentDate?._seconds ??
      a.paymentDate?.seconds ??
      0;

    const second =
      b.paymentDate?._seconds ??
      b.paymentDate?.seconds ??
      0;

    return second - first;
  });

  return receipts;
}

export async function getAllReceipts(search = "") {
  const snapshot = await db.collection("receipts").get();

  let receipts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (search) {
    const keyword = search.toLowerCase();

    receipts = receipts.filter((receipt) =>
      [
        receipt.receiptNumber,
        receipt.invoiceNumber,
        receipt.customerName,
        receipt.customerId,
        receipt.projectName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }

  receipts.sort((a, b) => {
    const first =
      a.paymentDate?._seconds ??
      a.paymentDate?.seconds ??
      0;

    const second =
      b.paymentDate?._seconds ??
      b.paymentDate?.seconds ??
      0;

    return second - first;
  });

  return receipts;
}