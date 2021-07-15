import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {MapProvider} from "../util/map_interface";

function MyApp({ Component, pageProps }: AppProps) {
  return <MapProvider>
    <Component {...pageProps} />
  </MapProvider>
}
export default MyApp
