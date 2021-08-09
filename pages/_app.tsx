import type { AppProps } from 'next/app'
import { useEffect } from "react";

import { MapProvider } from "../util/context/provider";

import firebase from 'firebase';
import "firebase/analytics"

import '../styles/globals.scss'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
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
