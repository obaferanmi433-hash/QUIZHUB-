import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCGB35tyDPYhkrbzB76CvQB2BE0GpAR3w8",
  authDomain: "quizhub-4c410.firebaseapp.com",
  projectId: "quizhub-4c410",
  storageBucket: "quizhub-4c410.firebasestorage.app",
  messagingSenderId: "674422240506",
  appId: "1:674422240506:web:4e36f2427dd55f66e38543"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
