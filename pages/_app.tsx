import type { AppProps } from 'next/app'
import {MapProvider} from "../util/map_interface";

import '../styles/globals.css'

const App = ({ Component, pageProps }: AppProps) => {
  return <MapProvider>
    <Component {...pageProps} />
  </MapProvider>
}

export default App
