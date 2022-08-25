import styles from "../../styles/editions.module.scss";
import { useState } from "react";
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
  const editions = data.Items?.[0];

  return {
    props: {
      editions,
    },
  };
};

const Editions: NextPage<IEditionProps> = ({ editions }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const context = useWeb3React<any>();
  const { account, provider, chainId } = context;

  // useEffect(() => {
  //   if (!!provider && chainId == targetChainId && !!account) {
  //     getDatas();
  //   }
  // }, [provider, chainId]);

  // const getDatas = async () => {
  //   const getSigner = provider.getSigner();
  //   const contract = new ethers.Contract(
  //     contractAddress,
  //     Contract.abi,
  //     getSigner
  //   );
  // };

  const handleMint = async (categoriesId: number) => {
    const getSigner = provider.getSigner();
    const contract = new ethers.Contract(
      editions.address,
      ContractAbi.abi,
      getSigner
    );
    try {
      const tx = await contract.mintUSDC(1, categoriesId);
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
  };

  const approve = async () => {
    setIsLoading(true);
    const getSigner = provider.getSigner();
    const contract = new ethers.Contract(
      "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
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
      "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
      ContractUsdcAbi,
      getSigner
    );

    let allowance = await contract.allowance(account, editions.address);
    console.log(allowance);
  };

  return (
    <>
      <Header />
      <section className={styles.edition}>
        <Container>
          <Row>
            {editions.categories.map((item: string, i: any) => (
              <Col md={4}>
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
                      <button
                        onClick={() => getAllowance()}
                        className={styles.mint}
                      >
                        mint
                      </button>
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
