import dotenv from "dotenv";
import admin from "firebase-admin";
import fs from "fs";

dotenv.config();

// Initialize Firebase Admin with the service account
if (!admin.apps.length) {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountPath) {
    throw new Error("❌ FIREBASE_SERVICE_ACCOUNT is missing from the .env");
  }
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();

// Assign a role to a user
async function assignRole(uid, role) {
  try {
    await auth.setCustomUserClaims(uid, { role });
    console.log(`✅ Role "${role}" assigned to the user with UID: ${uid}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error assigning role:", err);
    process.exit(1);
  }
}

const [,, uid, role] = process.argv;

if (!uid || !role) {
  console.error("Uso: node scripts/assignRole.js <uid> <role>");
  process.exit(1);
}

assignRole(uid, role);