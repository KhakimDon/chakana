import { getApps, initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

// CHANGE THIS TO YOUR APP ID

const firebaseConfig = {
  apiKey: 'AIzaSyBhVDIWESPjDMIBNHwb8H_2DuladXbAvy0',
  authDomain: 'xolodilnik-a9b1c.firebaseapp.com',
  projectId: 'xolodilnik-a9b1c',
  storageBucket: 'xolodilnik-a9b1c.appspot.com',
  messagingSenderId: '982363687648',
  appId: '1:982363687648:web:e81c44677fc8be41d35e85',
  measurementId: 'G-XYCKJ6PDBY',
}

const apps = getApps()

export const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig)

export const messaging = getMessaging(app)

export default defineNuxtPlugin(() => {
  if (process.client) {
    return {
      provide: {
        messaging,
      },
    }
  }
})

// import { getApps, initializeApp } from 'firebase/app'
// import { getMessaging } from 'firebase/messaging'
//
// // CHANGE THIS TO YOUR APP ID
//
// const firebaseConfig = {
//   apiKey: 'AIzaSyDEv5OF3zxnwslBwba8-Lv7KuzJZtf8rkE',
//   authDomain: 'xolodilnik-55eb9.firebaseapp.com',
//   projectId: 'xolodilnik-55eb9',
//   storageBucket: 'xolodilnik-55eb9.appspot.com',
//   messagingSenderId: '667771902581',
//   appId: '1:667771902581:web:cb4db1e59ee2abf1bbf63c',
//   measurementId: 'G-YGJDLXQDWY',
// }
//
// const apps = getApps()
//
// const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig)
//
// // if ('serviceWorker' in navigator) {
// //   navigator.serviceWorker
// //     .register('/firebase-messaging-sw.js')
// //     .then((registration) => {
// //       getMessaging(app).useServiceWorker(registration)
// //     })
// //     .catch((err) => {
// //       console.error('Service Worker registration failed', err)
// //     })
// // }
//
// export default defineNuxtPlugin(() => {
//   if (process.client) {
//     const messaging = getMessaging(app)
//     return {
//       provide: {
//         messaging,
//       },
//     }
//   }
// })
