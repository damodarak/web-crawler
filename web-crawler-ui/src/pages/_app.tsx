import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from "@/components/Layout";
import Head from "next/head";
import {redirect} from "@/utils/utils";

function App({ Component, pageProps }: AppProps) {
    return (
      <Layout>
        <Head>
          <title>Web Crawler</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
        </Head>

        <Component {...pageProps} />
      </Layout>
    )
}

export default App;