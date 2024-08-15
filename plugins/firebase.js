import { getApps, initializeApp } from 'firebase/app'
import { getMessaging, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyDEv5OF3zxnwslBwba8-Lv7KuzJZtf8rkE',
  authDomain: 'xolodilnik-55eb9.firebaseapp.com',
  projectId: 'xolodilnik-55eb9',
  storageBucket: 'xolodilnik-55eb9.appspot.com',
  messagingSenderId: '667771902581',
  appId: '1:667771902581:web:cb4db1e59ee2abf1bbf63c',
  measurementId: 'G-YGJDLXQDWY',
}

export default defineNuxtPlugin((nuxtApp) => {
  if (
    process.client &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  ) {
    const apps = getApps()
    const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig)

    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        const messaging = getMessaging(app)
        messaging.useServiceWorker(registration)

        // Handle incoming messages
        onMessage(messaging, (payload) => {
          console.log('Message received. ', payload)
        })

        nuxtApp.provide('messaging', messaging)
      })
      .catch((err) => {
        console.error('Service Worker registration failed: ', err)
      })
  } else {
    console.warn("This browser doesn't support Firebase Messaging.")
  }
})
