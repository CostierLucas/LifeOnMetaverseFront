import { useEffect } from "react";
import {
  coinbaseWallet,
  hooks,
} from "../../../WalletHelpers/connectors/coinbaseWallet";
import { Accounts } from "../accounts";
import { Status } from "../status";
import ConnectWithSelect from "../connectWithSelect";

const {
  useChainId,
  useAccounts,
  useError,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks;

export default function CoinbaseWalletCard() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  const provider = useProvider();
  const ENSNames = useENSNames(provider);

  // attempt to connect eagerly on mount
  useEffect(() => {
    void coinbaseWallet.connectEagerly();
  }, []);

  return (
    <ConnectWithSelect
      connector={coinbaseWallet}
      chainId={chainId}
      isActivating={isActivating}
      error={error}
      isActive={isActive}
      wallet="coinbaseWallet"
    />
  );
}
