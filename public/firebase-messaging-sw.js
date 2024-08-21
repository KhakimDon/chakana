importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js');

// CHANGE THIS TO YOUR APP ID

const firebaseConfig = {
  apiKey: "AIzaSyBhVDIWESPjDMIBNHwb8H_2DuladXbAvy0",
  authDomain: "xolodilnik-a9b1c.firebaseapp.com",
  projectId: "xolodilnik-a9b1c",
  storageBucket: "xolodilnik-a9b1c.appspot.com",
  messagingSenderId: "982363687648",
  appId: "1:982363687648:web:e81c44677fc8be41d35e85",
  measurementId: "G-XYCKJ6PDBY"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging.isSupported() ? firebase.messaging() : null

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };

  self.registration.showNotification(notificationTitle,
      notificationOptions);
});
