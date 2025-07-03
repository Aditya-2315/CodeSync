
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
   apiKey: "AIzaSyBc3xq8bP8ZkoQl3Am-FECIypfQ5hOYoEg",
  authDomain: "codesync-83ab6.firebaseapp.com",
  projectId: "codesync-83ab6",
  storageBucket: "codesync-83ab6.firebasestorage.app",
  messagingSenderId: "94262791614",
  appId: "1:94262791614:web:ae4f58b10d4744efe3bdef",
  measurementId: "G-76XDNF5JC3"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload)=>{
    console.log('[firebase-messaging-sw.js] Received backgroung message',payload);
    const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'CodeSync', {
    body: body || 'You have a new message',
    icon: '/pwa-icon-192.png',
  });
})