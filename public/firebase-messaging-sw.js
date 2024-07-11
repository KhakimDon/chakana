importScripts(
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js'
)

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

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  )
})
