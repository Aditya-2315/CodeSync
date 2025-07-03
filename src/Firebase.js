// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider,GithubAuthProvider,getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  //  apiKey: "AIzaSyBc3xq8bP8ZkoQl3Am-FECIypfQ5hOYoEg",
  // authDomain: "codesync-83ab6.firebaseapp.com",
  // projectId: "codesync-83ab6",
  // storageBucket: "codesync-83ab6.firebasestorage.app",
  // messagingSenderId: "94262791614",
  // appId: "1:94262791614:web:ae4f58b10d4744efe3bdef",
  // measurementId: "G-76XDNF5JC3"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app)
const auth = getAuth(app)
const analytics = getAnalytics(app);
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()
export {app,auth,analytics,db,googleProvider,githubProvider,messaging}