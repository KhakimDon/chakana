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
