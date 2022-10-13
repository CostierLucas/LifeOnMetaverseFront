import "../styles/globals.scss";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { SSRProvider } from "react-bootstrap";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import { MoralisProvider } from "react-moralis";
import {
  coinbaseWallet,
  hooks as coinbaseWalletHooks,
} from "../WalletHelpers/connectors/coinbaseWallet";
import {
  hooks as metaMaskHooks,
  metaMask,
} from "../WalletHelpers/connectors/metaMask";
import {
  hooks as walletConnectHooks,
  walletConnect,
} from "../WalletHelpers/connectors/walletConnect";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const connectors: [
  MetaMask | WalletConnect | CoinbaseWallet,
  Web3ReactHooks
][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
];
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>LifeOnMetaverse</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <SSRProvider>
        <Web3ReactProvider connectors={connectors}>
          <MoralisProvider
            appId="VSx6XsCTcW2GSZj8UjWcziZPAHRbPDjS5nKVkJWn"
            serverUrl="https://fdo643g2zf9v.usemoralis.com:2053/server"
          >
            <SessionProvider session={session}>
              <NextNProgress />
              <ToastContainer />
              <Component {...pageProps} />
            </SessionProvider>
          </MoralisProvider>
        </Web3ReactProvider>
      </SSRProvider>
    </>
  );
}

export default MyApp;
