import { cert, initializeApp } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../../multi-ai.json" with { type: "json" };

export const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});

export const auth = getAuth(firebaseApp);
