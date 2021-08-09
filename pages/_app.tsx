import type { AppProps } from 'next/app'
import { MapProvider } from "../util/context/provider";

import firebase from 'firebase';
import "firebase/analytics"

import '../styles/globals.scss'
import { useEffect } from "react";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

const analytics = firebase.analytics

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message))
    console.error("Firebase initialization error", err.stack)
}

const App = ({ Component, pageProps }: AppProps) => {

  useEffect(() => {
    analytics().logEvent("screen_view")
  }, [])

  return <MapProvider>
    <Component {...pageProps} />
  </MapProvider>
}

export default App

export const DEBUG = false
