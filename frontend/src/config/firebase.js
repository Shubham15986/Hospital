
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaD9xnLBeoCU8jZExoC7xLyK0Keg4TqJA",
  authDomain: "hospital-bdf94.firebaseapp.com",
  projectId: "hospital-bdf94",
  storageBucket: "hospital-bdf94.firebasestorage.app",
  messagingSenderId: "65265333388",
  appId: "1:65265333388:web:c4b1786230004f11a377a9",
  measurementId: "G-TLJFD9BYTE"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);

export default app;
