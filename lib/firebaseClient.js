// lib/firebaseClient.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseEnabled = !!cfg.apiKey;

let app;
if (firebaseEnabled) {
  app = getApps().length ? getApp() : initializeApp(cfg);
}

export const auth = firebaseEnabled ? getAuth(app) : null;
export const db = firebaseEnabled ? getFirestore(app) : null;
export const storage = firebaseEnabled ? getStorage(app) : null;

// Keep admin emails as before
export const adminEmails = (() => {
  try {
    return JSON.parse(process.env.NEXT_PUBLIC_ADMIN_EMAILS || "[]");
  } catch {
    return [];
  }
})();
