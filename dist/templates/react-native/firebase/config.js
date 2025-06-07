"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.app = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};
// initialize firebase
const app = (0, app_1.getApps)().length === 0 ? (0, app_1.initializeApp)(firebaseConfig) : (0, app_1.getApps)()[0];
exports.app = app;
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
