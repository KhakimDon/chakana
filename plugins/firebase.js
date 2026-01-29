// import { getApps, initializeApp } from 'firebase/app'
// import { getMessaging, isSupported } from 'firebase/messaging'
//
// const firebaseConfig = {
//   apiKey: 'AIzaSyBhVDIWESPjDMIBNHwb8H_2DuladXbAvy0',
//   authDomain: 'xolodilnik-a9b1c.firebaseapp.com',
//   projectId: 'xolodilnik-a9b1c',
//   storageBucket: 'xolodilnik-a9b1c.appspot.com',
//   messagingSenderId: '982363687648',
//   appId: '1:982363687648:web:e81c44677fc8be41d35e85',
//   measurementId: 'G-XYCKJ6PDBY',
// }
//
// const apps = getApps()
// export const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig)
//
// export default defineNuxtPlugin(async (nuxtApp) => {
//   const { $isClient } = useNuxtApp()
//
//   if ($isClient) {
//     // Check if messaging is supported in the current browser
//     const supported = await isSupported()
//     if (supported) {
//       const messaging = getMessaging(app)
//       nuxtApp.provide('messaging', messaging)
//     } else {
//       console.warn('Firebase Messaging is not supported in this browser.')
//     }
//   }
// })

// Пустой плагин для предотвращения ошибки импорта
export default defineNuxtPlugin(() => {
  // Плагин отключен, код закомментирован выше
})
