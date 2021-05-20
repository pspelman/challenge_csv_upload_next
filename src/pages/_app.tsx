import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from "react";
import index from '../lib/db'

function MyApp({ Component, pageProps }) {

  return <Component {...pageProps} />
}

export default MyApp
