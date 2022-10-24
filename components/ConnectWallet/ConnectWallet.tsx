import { useState, useEffect } from "react";
import { Col, Button, Dropdown, Spinner, Modal } from "react-bootstrap";
import styles from "./ConnectWallet.module.scss";
import { useWeb3React } from "@web3-react/core";
import { metaMask } from "../../WalletHelpers/connectors/metaMask";
import { coinbaseWallet } from "../../WalletHelpers/connectors/coinbaseWallet";
import { walletConnect } from "../../WalletHelpers/connectors/walletConnect";

import MetaMaskCard from "../Web3/connectors/MetamaskCard";
import CoinbaseWalletCard from "../Web3/connectors/CoinbaseWalletCard";
import WalletConnectCard from "../Web3/connectors/WalletConnectCard";
import { metamaskURL } from "../../WalletHelpers/contractVariables";

const ConnectWallet = () => {
  const context = useWeb3React<any>();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { connector, account } = context;
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      setIsMobile(true);
    }
  }, []);

  const toggle = () => setShowModal(!showModal);

  const handleConnection = () => {
    if (!!!account) toggle();
  };

  useEffect(() => {
    void metaMask.connectEagerly();
    void coinbaseWallet.connectEagerly();
    void walletConnect.connectEagerly();
  }, []);

  const modalContent = () => {
    return (
      <Col className={styles.modalContent}>
        <div
          className={styles.metamask}
          onClick={() => {
            if (isMobile && !window.ethereum) {
              return (window.location.href = metamaskURL);
            }
          }}
        >
          <MetaMaskCard />
        </div>
        <div className={styles.walletConnect}>
          <CoinbaseWalletCard />
        </div>
        <div className={styles.walletLink}>
          <WalletConnectCard />
        </div>
      </Col>
    );
  };

  return (
    <>
      <Col
        style={{
          display: "flex",
          justifyContent: "center",
          marginRight: "15px",
        }}
      >
        {account ? (
          <>
            <Dropdown>
              <Dropdown.Toggle
                variant="dark"
                style={{
                  fontFamily: "Hanson",
                  fontSize: "14px",
                  marginBottom: "0",
                }}
                className="rounded-pill px-5 my-2"
              >
                {`${account.substring(0, 6)}...${account.substring(
                  account.length - 4
                )}`}
              </Dropdown.Toggle>

              <Dropdown.Menu className={styles.disconnect}>
                <Dropdown.Item
                  className={styles.text}
                  onClick={() => void connector.deactivate()}
                >
                  Disconnect
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        ) : (
          <Button
            className={styles.connectButton}
            onClick={() => handleConnection()}
          >
            Connect Wallet
          </Button>
        )}
      </Col>

      <Modal
        show={showModal}
        onHide={toggle}
        centered
        aria-labelledby="Wallet connection"
        animation={false}
      >
        <Modal.Body onClick={() => toggle()}>{modalContent()}</Modal.Body>
      </Modal>
    </>
  );
};

export default ConnectWallet;
