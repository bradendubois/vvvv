import type { AppProps } from 'next/app'
import { MapProvider } from "../util/context/provider";

import '../styles/globals.scss'

const App = ({ Component, pageProps }: AppProps) => {
  return <MapProvider>
    <Component {...pageProps} />
  </MapProvider>
}

export default App

export const DEBUG = true;
