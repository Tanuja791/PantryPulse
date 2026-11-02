importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB6ru6q-UltrgRiKifGFQ_Po08VSG_gLmg",
  authDomain: "pantrypulse-89108.firebaseapp.com",
  projectId: "pantrypulse-89108",
  storageBucket: "pantrypulse-89108.firebasestorage.app",
  messagingSenderId: "32876996056",
  appId: "1:32876996056:web:d6bd7443b2aa10bb3c3ead"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});