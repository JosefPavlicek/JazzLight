import * as admin from "firebase-admin";

function getServiceAccount() {
  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!encoded) return undefined;
  return JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
}

export function getFirebaseAdminApp() {
  if (admin.apps.length > 0) return admin.apps[0]!;
  const serviceAccount = getServiceAccount();

  if (!process.env.FIREBASE_DATABASE_URL || !serviceAccount) return null;

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

export function getDatabase() {
  const app = getFirebaseAdminApp();
  return app ? admin.database(app) : null;
}
