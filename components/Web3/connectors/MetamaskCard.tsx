import { useEffect } from "react";
import { hooks, metaMask } from "../../../WalletHelpers/connectors/metaMask";
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

export default function MetaMaskCard() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  const provider = useProvider();
  const ENSNames = useENSNames(provider);

  /*  useEffect(() => {
    void metaMask.connectEagerly();
  }, []); */

  return (
    <ConnectWithSelect
      connector={metaMask}
      chainId={chainId}
      isActivating={isActivating}
      error={error}
      isActive={isActive}
      wallet="metamask"
    />
  );
}
