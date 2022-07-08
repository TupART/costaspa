import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// import 'firebase/storage' // If you need it
// import 'firebase/analytics' // If you need it
// import 'firebase/performance' // If you need it

const clientCredentials = {
  apiKey: 'AIzaSyBLzEQ8Z93ykAKro5h3eCG6QZlAD5YC758',
  authDomain: 'helpdesk-it-spa.firebaseapp.com',
  projectId: 'helpdesk-it-spa',
  storageBucket: 'helpdesk-it-spa.appspot.com',
  messagingSenderId: '74958693465',
  appId: '1:74958693465:web:aff450f9650e13a4037d48'
}

export const app = !getApps().length
  ? initializeApp(clientCredentials)
  : getApp()
export const db = getFirestore(app)
export const auth = getAuth(app)
