import { getMessaging } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB6ru6q-UltrgRiKifGFQ_Po08VSG_gLmg",
  authDomain: "pantrypulse-89108.firebaseapp.com",
  projectId: "pantrypulse-89108",
  storageBucket: "pantrypulse-89108.firebasestorage.app",
  messagingSenderId: "32876996056",
  appId: "1:32876996056:web:d6bd7443b2aa10bb3c3ead"
};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);
export const vapidKey = "BCT9qmVgMCs3cl_bdUKQOHhNl81c5Y_gDvmjcstESnvSt2btS7vZSnvD-LeB875xy8nn7sE2Bv6XDSdjwOFtpwM";
export { messaging };

export default app;