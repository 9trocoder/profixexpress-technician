import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtlWyHN08dp6pIXvLmGh7ngRex19Z3HE4",
  authDomain: "profixepress.firebaseapp.com",
  databaseURL: "https://profixepress-default-rtdb.firebaseio.com",
  projectId: "profixepress",
  storageBucket: "profixepress.firebasestorage.app",
  messagingSenderId: "295555866716",
  appId: "1:295555866716:web:e2dc25255062e516604699",
  measurementId: "G-F57E2XSBC0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const storage = getStorage(app);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BKWy0gYGT1UnhM8vt8tTJ7V78rCdMUdS3CUMdDwdmhbZZcAdpm99eq3AHrYirSFNSXxxYf5MkhYq71K3x3TI6zU",
    });
    if (token) {
      console.log("Notification token:", token);
      // Optionally, save the token to your database here.
      return token;
    } else {
      console.warn("No registration token available.");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
};

// Listen for incoming messages (foreground)
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
  alert(`Notification: ${payload.notification.title}`);
});

export {
  auth,
  db,
  googleProvider,
  facebookProvider,
  signInWithPopup,
  signOut,
  ref,
  set,
  get,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  storage,
  messaging,
};
