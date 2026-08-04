import bcrypt from "bcryptjs";
import { firestore } from "./firebaseAdmin.js";

async function migrate() {
  const snapshot = await firestore.collection("staff").get();

  console.log(`Found ${snapshot.size} staff accounts.`);

  for (const doc of snapshot.docs) {
    const data = doc.data();

    // Skip if already migrated
    if (data.passwordHash) {
      console.log(`${data.staffId} already migrated.`);
      continue;
    }

    if (!data.password) {
      console.log(`${data.staffId} has no password field.`);
      continue;
    }

    const hash = await bcrypt.hash(data.password, 12);

    await doc.ref.update({
      passwordHash: hash,
    });

    console.log(`✔ Migrated ${data.staffId}`);
  }

  console.log("=================================");
  console.log("Migration Complete");
  process.exit(0);
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});