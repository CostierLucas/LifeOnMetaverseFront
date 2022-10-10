import { useState } from "react";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import db from "../../config/db";
import { IEditionProps } from "../../interfaces/interfaces";
import Accordion from "react-bootstrap/Accordion";
import styles from "./updateEdition.module.scss";
import { Form, Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import ContractAbi from "../../WalletHelpers/contractTokenAbi.json";
import {
  contractAddress,
  contractUsdc,
} from "../../WalletHelpers/contractVariables";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import contractUsdcAbi from "../../WalletHelpers/contractUsdcAbi.json";
import contractTokenAbi from "../../WalletHelpers/contractTokenAbi.json";

export const getStaticProps: GetStaticProps = async (context) => {
  const params = {
    TableName: "life-edition",
  };

  const data = await db.scan(params).promise();
  const editions = data.Items;

  return {
    props: {
      editions,
    },
  };
};

const UpdateEdition: React.FC<IEditionProps> = ({ editions }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingTransfer, setIsLoadingTransfer] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const context = useWeb3React<any>();
  const { account, provider, chainId } = context;

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const artist = e.currentTarget.artist.value;
    const title = e.currentTarget.titlee.value;
    const description = e.currentTarget.description.value;
    const categorie = e.currentTarget.type.value;
    const date = e.currentTarget.date.value;
    const opensea = e.currentTarget.opensea.value;
    setIsLoading(true);

    try {
      fetch("/api/edition/modify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          artist,
          title,
          description,
          categorie,
        }),
      });
      setIsLoading(false);
      setIsConfirmed(true);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const checkAllowance = async (address: string) => {
    const getSigner = provider.getSigner();
    const contractUsdcInstance = new ethers.Contract(
      contractUsdc,
      contractUsdcAbi,
      getSigner
    );

    try {
      const allowance = await contractUsdcInstance.allowance(account, address);
      return allowance;
    } catch (error) {
      console.log(error);
    }
  };

  const approve = async (address: string) => {
    setIsLoading(true);
    const getSigner = provider.getSigner();
    const contract = new ethers.Contract(
      contractUsdc,
      contractUsdcAbi,
      getSigner
    );

    let approve = await contract.approve(
      address,
      "2000000000000000000000000000000000"
    );

    setIsLoading(false);
  };

  const handleTransfer = async (address: string) => {
    const getSigner = provider.getSigner();
    const contract = new ethers.Contract(
      address,
      contractTokenAbi.abi,
      getSigner
    );

    setIsLoadingTransfer(true);

    if (amount !== 0) {
      try {
        const allowance = await checkAllowance(address);

        if (allowance < amount) {
          const approveToken = await approve(address);
        }

        const ethersToWei = ethers.utils.parseEther(amount.toString());
        const transfer = await contract.FundRoyalties(ethersToWei);
        await transfer.wait();
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("amount is 0");
    }

    setIsLoadingTransfer(false);
  };

  return (
    <div className={styles.update}>
      <h3>Modify edition</h3>
      <div className={styles.accordion}>
        {editions.map((edition, i: number) => (
          <Accordion key={i}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Edition #{i}</Accordion.Header>
              <Accordion.Body>
                <Form onSubmit={handleUpdate}>
                  <Form.Control
                    required
                    type="text"
                    name="date"
                    placeholder="Enter artist"
                    defaultValue={edition.date}
                    hidden
                  />
                  <div className={styles.formGroup}>
                    <label>Artist</label>
                    <Form.Control
                      required
                      type="text"
                      name="artist"
                      placeholder="Enter artist"
                      defaultValue={edition.artist}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter artist
                    </Form.Control.Feedback>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Title</label>
                    <Form.Control
                      required
                      type="text"
                      name="titlee"
                      placeholder="Diamond"
                      defaultValue={edition.title}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter title
                    </Form.Control.Feedback>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <Form.Control
                      required
                      placeholder="Enter description"
                      name="description"
                      as="textarea"
                      rows={3}
                      defaultValue={edition.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter baseURI
                    </Form.Control.Feedback>
                  </div>
                  <div className={styles.formGroup}>
                    <label>OpenSea</label>
                    <Form.Control
                      required
                      type="text"
                      name="opensea"
                      placeholder="Link opensea collection"
                      defaultValue={edition.opensea}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter title
                    </Form.Control.Feedback>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Categorie</label>
                    <Form.Select
                      aria-label="Default select example"
                      defaultValue={edition.type}
                      name="type"
                    >
                      <option value="single">Single</option>
                      <option value="album">Album</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Please enter categorie
                    </Form.Control.Feedback>
                  </div>
                  <div className={styles.btnSubmitModify}>
                    <Button type="submit">
                      {isLoading ? (
                        <Spinner animation="border" className="#fff" />
                      ) : (
                        "Modify collection"
                      )}
                    </Button>
                  </div>
                  <div className={styles.btnTransfer}>
                    <input
                      type="number"
                      name="amount"
                      placeholder="Amount"
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <br />
                    <Button
                      className={styles.btnTransfer}
                      onClick={() => handleTransfer(edition.address)}
                    >
                      {isLoadingTransfer ? (
                        <Spinner animation="border" className="#fff" />
                      ) : (
                        "Transfer USDC"
                      )}
                    </Button>
                  </div>
                  <div className={styles.confirmed}>
                    {isConfirmed && <p> ✅ Collection modified </p>}
                  </div>
                  {/* <div className={styles.btnSubmitModify}>
                    <Button type="submit" variant="danger">
                      Delete collection
                    </Button>
                  </div> */}
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default UpdateEdition;
