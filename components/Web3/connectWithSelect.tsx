import type { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import type { Web3ReactHooks } from "@web3-react/core";
import type { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { WalletConnect } from "@web3-react/walletconnect";
import { useState } from "react";
import { getAddChainParameters } from "../../WalletHelpers/chains";
import { Button } from "react-bootstrap";
import { targetChainId } from "../../WalletHelpers/contractVariables";

export default function ConnectWithSelect({
  connector,
  chainId,
  isActivating,
  error,
  isActive,
  wallet,
}: {
  connector: MetaMask | WalletConnect | CoinbaseWallet | Network;
  chainId: ReturnType<Web3ReactHooks["useChainId"]>;
  isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>;
  error: ReturnType<Web3ReactHooks["useError"]>;
  isActive: ReturnType<Web3ReactHooks["useIsActive"]>;
  wallet: string;
}) {
  const isNetwork = connector instanceof Network;

  const [desiredChainId, setDesiredChainId] = useState<number>(
    isNetwork ? 1 : -1
  );

  if (error) {
    console.log(error);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Button
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            border: "none",
          }}
          onClick={() =>
            connector instanceof WalletConnect || connector instanceof Network
              ? void connector.activate(
                  desiredChainId === -1 ? undefined : desiredChainId
                )
              : /* void connector.activate(
                    desiredChainId === -1
                      ? undefined
                      : getAddChainParameters(desiredChainId)
                  ) */
                void connector.activate(getAddChainParameters(targetChainId))
          }
        >
          Try Again?
        </Button>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Button
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            border: "none",
          }}
          onClick={
            isActivating
              ? undefined
              : () =>
                  connector instanceof WalletConnect ||
                  connector instanceof Network
                    ? connector.activate(
                        desiredChainId === -1 ? undefined : desiredChainId
                      )
                    : /* connector.activate(
                        desiredChainId === -1
                          ? undefined
                          : getAddChainParameters(desiredChainId)
                      ) */
                      connector.activate(getAddChainParameters(targetChainId))
          }
          disabled={isActivating}
        >
          {wallet == "walletConnect" && (
            <>
              <span style={{ paddingRight: "5px" }}>WalletLink</span>
              <img
                src="/pictures/walletConnect.svg"
                width={30}
                height={30}
                alt="logo walletconnect"
              />
            </>
          )}
          {wallet == "metamask" && (
            <>
              <span style={{ paddingRight: "5px" }}>Metamask</span>
              <img
                src="/pictures/metamask.svg"
                width={30}
                height={30}
                alt="logo metamask"
              />
            </>
          )}
          {wallet == "coinbaseWallet" && (
            <>
              <span style={{ paddingRight: "5px" }}>Coinbase</span>
              <img
                src="/pictures/coinBase.png"
                width={30}
                height={30}
                alt="logo coinbase"
              />
            </>
          )}
        </Button>
      </div>
    );
  }
}
