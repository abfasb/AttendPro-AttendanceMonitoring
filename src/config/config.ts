import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBAPuUHFKVrzMHA_CWxBITCqci6-RK5Beg",
  authDomain: "pharma-kiosk-ad218.firebaseapp.com",
  projectId: "pharma-kiosk-ad218",
  storageBucket: "pharma-kiosk-ad218.appspot.com",
  messagingSenderId: "270716874976",
  appId: "1:270716874976:web:cd7c864190e61919912085",
  measurementId: "G-4WMGN33EMH"
};

export const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);