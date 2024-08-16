import { getApps, initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

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

const apps = getApps()

const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig)

export default defineNuxtPlugin(() => {
  return {
    provide: {
      messaging: getMessaging(app),
    },
  }
})
