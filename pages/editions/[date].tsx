import styles from "./editions.module.scss";
import React, { useState, useEffect } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Header from "../../components/header/header";
import db from "../../config/db";
import { IEditionProps } from "../../interfaces/interfaces";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import ContractAbi from "../../WalletHelpers/contractTokenAbi.json";
import ContractUsdcAbi from "../../WalletHelpers/contractUsdcAbi.json";
import ContractFactoryAbi from "../../WalletHelpers/contractFactoryAbi.json";
import {
  contractUsdc,
  contractAddress,
  targetChainId,
} from "../../WalletHelpers/contractVariables";
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import { toast } from "react-toastify";
import Countdown from "react-countdown";
import Renderer from "../../components/countdown/countdown";
import rect from "../../assets/images/rectangle_gradiant.png";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { date } from "yup";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const date = context.params?.date as string;

  const params = {
    TableName: "life-edition",
    FilterExpression: "#date =:date",
    ExpressionAttributeValues: { ":date": parseInt(date) },
    ExpressionAttributeNames: { "#date": "date" },
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
  const [isApproving, setIsApproving] = useState<number>(0);
  const [allowanceNumber, setAllowanceNumber] = useState<string>("");
  const [totalTokens, setTotalTokens] = useState<string>("");
  const [isApproveLoading, setIsApproveLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const context = useWeb3React<any>();
  const [timestamp, setTimestamp] = useState<number>(0);
  const [mintOpen, setMintOpen] = useState<boolean>(false);
  const { account, provider, chainId } = context;
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!!provider && chainId == targetChainId && !!account) {
      getDatas();
    }
    fetchImageUrl();
    let total = 0;
    editions?.supply.forEach((supply) => {
      total += parseInt(supply);
    });
    setTotalTokens(total.toString());
  }, [chainId, provider]);

  const getDatas = async () => {
    const getSigner = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      ContractAbi.abi,
      getSigner
    );

    const all = await getAllowance();
    if (editions.startDate * 1000 > Date.now()) {
      setMintOpen(false);
    } else {
      setMintOpen(true);
    }
    setTimestamp(editions.startDate * 1000);
  };

  const handleMint = async (categoriesId: number) => {
    const getSigner = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      ContractFactoryAbi.abi,
      getSigner
    );
    setIsLoading(true);
    setIsApproving(categoriesId);
    try {
      const tx = await contract.mintUSDCFactory(
        editions.address,
        contractUsdc,
        1,
        categoriesId
      );
      await tx.wait();
      toast.success("Minted successfully");
      console.log(tx);
      let mail = await sendEmailConfirmation(categoriesId, tx);
    } catch (e) {
      toast.error("Minting failed");
    }
    setIsLoading(false);
  };

  const sendEmailConfirmation = async (categoriesId: number, tx: any) => {
    try {
      fetch("/api/contact/confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          tx: tx.hash,
          category: editions?.categories[categoriesId],
          price: ethers.utils
            .formatEther(editions?.price[categoriesId])
            .toString(),
        }),
      });
    } catch (e) {
      console.log(e);
    }
  };

  const approve = async () => {
    setIsApproveLoading(true);
    const getSigner = provider.getSigner();
    const contract = new ethers.Contract(
      contractUsdc,
      ContractUsdcAbi,
      getSigner
    );

    try {
      const tx = await contract.approve(
        contractAddress,
        ethers.constants.MaxUint256
      );
      await tx.wait();
      toast.success("Approved successfully");
    } catch (e) {
      toast.error("Approving failed");
    }
    getDatas();
    setIsApproveLoading(false);
  };

  const getAllowance = async () => {
    const getSigner = provider.getSigner();
    const contract = new ethers.Contract(
      contractUsdc,
      ContractUsdcAbi,
      provider
    );

    let allowance = await contract.allowance(account, contractAddress);
    let parseAllowance = ethers.utils.formatUnits(allowance, "wei");
    setAllowanceNumber(parseAllowance);
    return parseAllowance;
  };

  const fetchImageUrl = async () => {
    let url = [];
    for (let i = 0; i < editions?.baseUri.length; i++) {
      const imageNft = await fetch(editions?.baseUri[i]);
      const imageNftJson = await imageNft.json();
      const finalImage = imageNftJson.image;
      url.push(finalImage);
    }
    setImageUrl(url);
  };

  return (
    <>
      <Header />
      <section className={styles.edition}>
        <Container fluid>
          <Row className={styles.row}>
            <Col md={6}>
              <div className={styles.colBanner}>
                <div className={styles.banner}>
                  <Image
                    src={editions.image as string}
                    alt="logo"
                    objectFit="cover"
                    layout="fill"
                  />
                </div>
                <div className={styles.centerImg}>
                  <Image
                    src={editions.image as string}
                    width="200%"
                    height="200%"
                    objectFit="cover"
                    alt="logo"
                  />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className={styles.content}>
                <div className={styles.contentDirect}>
                  <div className={styles.category}>
                    <p>{editions.categorie_selected.toUpperCase()}</p>
                    <hr className={styles.hrCategorie} />
                  </div>
                  <h2>
                    {editions.title}{" "}
                    <span>
                      <Image src={rect} width={60} height={12} />
                    </span>
                  </h2>
                  <p>{editions.description}</p>
                  <div className={styles.spotifyPlayer}>
                    <iframe
                      src={editions.spotify as string}
                      width="100%"
                      height="80"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    ></iframe>
                  </div>
                  <div className={styles.buyIn}>
                    <a className={styles.buttonBuyIn}> BUY IT IN : </a>
                    <hr className={styles.hrBuy} />
                  </div>
                  <div>
                    {timestamp && !mintOpen ? (
                      <Countdown renderer={Renderer} date={timestamp} />
                    ) : (
                      <div className={styles.mintOpen}>
                        <p>Mint Open</p>
                      </div>
                    )}
                  </div>
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
                    {imageUrl.length != 0 && imageUrl[i].includes(".mp4") ? (
                      <video
                        width="100%"
                        height="100%"
                        controls
                        autoPlay
                        loop
                        muted
                      >
                        <source src={imageUrl[i]} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        width="100%"
                        height="100%"
                        src={imageUrl[i]}
                        alt="image animate"
                      ></img>
                    )}
                  </div>
                  <div className={styles.editionItemCategories}>
                    <div>
                      <p>
                        {editions.categories[i]} - {editions.supply[i]} tokens
                      </p>
                    </div>
                    <div>
                      <p>{editions.type}</p>
                    </div>
                  </div>
                  <div className={styles.editionItemBloc}>
                    <p className={styles.percentages}>
                      {(editions.royalty * editions.percentages[i]) /
                        100 /
                        parseInt(editions.supply[i])}
                      %
                    </p>
                    <p className={styles.ownership}>OWNERSHIP PER TOKEN</p>
                    <hr />
                    <p className={styles.price}>
                      {ethers.utils
                        .formatEther(editions.price[i].toString())
                        .toString()}{" "}
                      $
                    </p>
                    <div className={styles.details}>
                      <div>
                        <ul>
                          {editions.titleList.length > 0 &&
                            editions.titleList[i].map(
                              (item: string, j: any) => <li key={i}>{item}</li>
                            )}
                        </ul>
                      </div>
                    </div>
                    <div className={styles.spaceDetails}></div>
                    {status !== "unauthenticated" ? (
                      <>
                        <div>
                          <CrossmintPayButton
                            clientId="1516fbcf-1363-4a34-bfa0-ac78c2ae4e8a"
                            mintConfig={{
                              type: "erc-721",
                              totalPrice: "0.001",
                              _contract: editions.address,
                              _category: i,
                              _amount: 1,
                            }}
                            environment="staging"
                            className={styles.crossmintButton}
                          />
                        </div>
                        <div>
                          {account ? (
                            allowanceNumber == "0" ? (
                              <button className={styles.mint} onClick={approve}>
                                {isApproveLoading ? (
                                  <Spinner animation="border" variant="dark" />
                                ) : (
                                  "Pay with USDC"
                                )}
                              </button>
                            ) : (
                              <button
                                className={styles.mint}
                                onClick={() => handleMint(i)}
                              >
                                {isLoading && isApproving == i ? (
                                  <Spinner animation="border" variant="dark" />
                                ) : (
                                  "Mint"
                                )}
                              </button>
                            )
                          ) : (
                            <button
                              className={styles.mint}
                              onClick={() =>
                                (document.documentElement.scrollTop = 0)
                              }
                            >
                              Connect Wallet First
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className={styles.redirect}>
                        <Link href="/auth">
                          <a>Login first</a>
                        </Link>
                      </div>
                    )}
                    <div>
                      <a
                        className={
                          editions.opensea == ""
                            ? styles.openseaLock
                            : styles.opensea
                        }
                        href={editions.opensea ? editions.opensea : "#"}
                      >
                        BUY ON OPENSEA
                      </a>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
        <Container className={styles.breakdown}>
          <div>
            <p>TOTAL TOKENS</p>
            <hr />
            <h3>{totalTokens}</h3>
          </div>
          <div>
            <p>TOTAL OWNERSHIP OFFERED</p>
            <hr />
            <h3>{editions.royalty}%</h3>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Editions;
