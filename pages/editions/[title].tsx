import styles from "./editions.module.scss";
import React, { useState, useEffect } from "react";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Header from "../../components/header/header";
import db from "../../config/db";
import { IEditionProps } from "../../interfaces/interfaces";
import { Col, Container, Row, Modal, Button } from "react-bootstrap";
import logo from "../../assets/images/banniere.jpeg";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import ContractAbi from "../../WalletHelpers/contractTokenAbi.json";
import ContractUsdcAbi from "../../WalletHelpers/contractUsdcAbi.json";
import ModalEdition from "../../components/modalEdition/modalEdition";
import { contractUsdc } from "../../WalletHelpers/contractVariables";
// import SpotifyPlayer from "react-spotify-web-playback";

export const getStaticPaths: GetStaticPaths = async () => {
  const params = {
    TableName: "life-edition",
  };

  const data = await db.scan(params).promise();
  const editions = data.Items;
  const paths = editions!.map((edition) => ({
    params: { title: edition.title },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const title = context.params?.title as string;
  const params = {
    TableName: "life-edition",
    FilterExpression: "#title =:title",
    ExpressionAttributeValues: { ":title": title },
    ExpressionAttributeNames: { "#title": "title" },
  };

  const data = await db.scan(params).promise();
  const editions = null || data.Items?.[0];

  return {
    props: {
      editions,
    },
  };
};

const Editions: NextPage<IEditionProps> = ({ editions }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [allowanceNumber, setAllowanceNumber] = useState<string>("");
  const context = useWeb3React<any>();
  const { account, provider, chainId } = context;

  // useEffect(() => {
  //   if (!!provider && chainId == targetChainId && !!account) {
  //     getDatas();
  //     setIsConnected(true);
  //   } else {
  //     setIsConnected(false);
  //   }
  // }, [chainId, provider]);

  // const getDatas = async () => {
  //   const getSigner = provider.getSigner();
  //   const contract = new ethers.Contract(
  //     contractAddress,
  //     ContractAbi.abi,
  //     getSigner
  //   );

  //   const all = await getAllowance();
  //   console.log(all);
  // };

  const handleMint = async (categoriesId: number) => {
    const getSigner = provider.getSigner();
    const contract = new ethers.Contract(
      editions.address,
      ContractAbi.abi,
      getSigner
    );
    try {
      const tx = await contract.mintUSDC(1, 0);
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
  };

  const approve = async () => {
    setIsLoading(true);
    const getSigner = provider.getSigner();
    const contract = new ethers.Contract(
      contractUsdc,
      ContractUsdcAbi,
      getSigner
    );

    let approve = await contract.approve(
      editions.address,
      "20000000000000000000000"
    );

    setIsLoading(false);
  };

  const getAllowance = async () => {
    const getSigner = provider.getSigner();
    const contract = new ethers.Contract(
      contractUsdc,
      ContractUsdcAbi,
      provider
    );

    let allowance = await contract.allowance(account, editions.address);
    let parseAllowance = ethers.utils.formatUnits(allowance, "wei");
    setAllowanceNumber(parseAllowance);
    return parseAllowance;
  };

  return (
    <>
      <Header />
      <section className={styles.edition}>
        <Container fluid>
          <Row className={styles.row}>
            <Col md={6}>
              <div className={styles.banner}>
                <Image
                  src={editions.image as string}
                  alt="logo"
                  objectFit="cover"
                  layout="fill"
                />
              </div>
            </Col>
            <Col md={6}>
              <div className={styles.content}>
                <div>
                  <h2>{editions.title}</h2>
                  <p>{editions.description}</p>
                  {/* <SpotifyPlayer
                    token="BQAI_7RWPJuqdZxS-I8XzhkUi9RKr8Q8UUNaJAHwWlpIq6..."
                    uris={["spotify:artist:6HQYnRM4OzToCYPpVBInuU"]}
                  /> */}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <Container>
          <hr className={styles.hr} />
          <Row>
            {editions.categories.map((item: string, i: any) => (
              <Col md={4} key={i}>
                <div className={styles.editionItem}>
                  <div className={styles.editionItemImg}>
                    <Image src={logo} layout="fill" />
                  </div>
                  <div className={styles.editionItemCategories}>
                    <div>
                      <p>{editions.categories[i]}</p>
                    </div>
                    <div>
                      <p>{editions.type}</p>
                    </div>
                  </div>
                  <div className={styles.editionItemBloc}>
                    <p className={styles.percentages}>
                      {editions.percentages[i]}%
                    </p>
                    <p className={styles.ownership}>OWNERSHIP PER TOKEN</p>
                    <hr />
                    <p className={styles.price}>$ {editions.price[i]} </p>
                    <div className={styles.details}></div>
                    <div>
                      <ul>
                        {editions.titleList &&
                          editions.titleList[i].map((item: string, j: any) => (
                            <li key={i}>{item}</li>
                          ))}
                      </ul>
                    </div>
                    <div>
                      <a
                        onClick={() => setModalShow(true)}
                        className={styles.readmore}
                        href="#"
                      >
                        READ MORE
                      </a>
                      <ModalEdition
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        title={`${editions.categories[i]} ${editions.type}`}
                      />
                    </div>
                    <div>
                      {account ? (
                        allowanceNumber == "0" ? (
                          <button className={styles.mint} onClick={approve}>
                            Approve first
                          </button>
                        ) : (
                          <button
                            className={styles.mint}
                            onClick={() => handleMint(i)}
                          >
                            Mint
                          </button>
                        )
                      ) : (
                        <button
                          // onClick={() => handleMint(i)}
                          className={styles.mint}
                        >
                          Connect Wallet First
                        </button>
                      )}
                    </div>
                    <div>
                      <a className={styles.opensea} href="https://google.com">
                        BUY ON OPENSEA
                      </a>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Editions;
