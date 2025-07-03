import { getToken,onMessage } from "firebase/messaging";
import { messaging } from "../Firebase";

export const requestNotificationPermission = async()=>{
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY, // from Firebase Console > Cloud Messaging
      serviceWorkerRegistration: registration,
    });

    if (token) {
      // Optionally: Save token to Firestore for later use
      return token;
    } else {
    }
  } catch (err) {
    console.error('⚠️ FCM Error:', err);
  }
};


onMessage(messaging,(payload)=>{
    console.log('Foreground push received')
})