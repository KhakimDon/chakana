importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js');

// CHANGE THIS TO YOUR APP ID

const firebaseConfig = {
  apiKey: 'AIzaSyDEv5OF3zxnwslBwba8-Lv7KuzJZtf8rkE',
  authDomain: 'xolodilnik-55eb9.firebaseapp.com',
  projectId: 'xolodilnik-55eb9',
  storageBucket: 'xolodilnik-55eb9.appspot.com',
  messagingSenderId: '667771902581',
  appId: '1:667771902581:web:cb4db1e59ee2abf1bbf63c',
  measurementId: 'G-YGJDLXQDWY',
}

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
