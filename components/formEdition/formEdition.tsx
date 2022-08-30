import { Button, Form } from "react-bootstrap";
import styles from "./formEdition.module.scss";
import {
  contractAddress,
  targetChainId,
} from "../../WalletHelpers/contractVariables";
import Contract from "../../WalletHelpers/contractFactoryAbi.json";
import { FormEvent, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import Spinner from "react-bootstrap/Spinner";
import { contractUsdc } from "../../WalletHelpers/contractVariables";
import ReactS3Client from "react-aws-s3-typescript";
import { s3Config } from "../../config/s3";

interface IEdition {
  artist: string;
  title: string;
  description: string;
  type: string;
  supply: Array<string>;
  categories: Array<string>;
  baseUri: Array<string>;
  price: Array<number>;
  percentages: Array<number>;
  image: File | null;
}

const FormEdition: React.FC = () => {
  const context = useWeb3React<any>();
  const { account, provider, chainId } = context;
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [address, setAddress] = useState("");
  const [edition, setEdition] = useState<IEdition>({
    artist: "",
    title: "",
    description: "",
    type: "",
    supply: [],
    categories: [],
    baseUri: [],
    price: [],
    percentages: [],
    image: null,
  });
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    const {
      artist,
      title,
      description,
      type,
      supply,
      categories,
      baseUri,
      price,
      percentages,
    } = edition;

    const form = e.currentTarget;
    e.preventDefault();
    setValidated(true);

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setIsLoading(false);
      return;
    } else if (
      supply.length !== price.length ||
      supply.length !== percentages.length ||
      supply.length !== baseUri.length ||
      supply.length !== categories.length
    ) {
      e.stopPropagation();
      setIsLoading(false);
      return;
    } else {
      let addressDeployed = await deployContract();
      let urlImage = await uploadFile();
      if (addressDeployed && urlImage) {
        fetch("/api/edition/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            artist,
            title,
            description,
            type,
            supply,
            categories,
            baseUri,
            price,
            percentages,
            address: addressDeployed,
            image: urlImage,
          }),
        });
        setAddress(addressDeployed);
        setIsConfirmed(true);
      }
    }
    setIsLoading(false);
  };

  const deployContract = async () => {
    const getSigner = provider.getSigner();
    const contractt = new ethers.Contract(
      contractAddress,
      Contract.abi,
      getSigner
    );
    try {
      let transaction = await contractt.getBytecode(
        edition.categories,
        edition.baseUri,
        edition.price,
        edition.supply,
        edition.percentages,
        contractUsdc,
        contractUsdc,
        contractUsdc
      );

      let deploy = await contractt.deploy(transaction, 11);
      await deploy.wait();
      const address = await contractt.getAddress(transaction, 11);
      console.log(address);
      return address;
    } catch (e: any) {
      console.log(e.message);
      return;
    }
  };

  const uploadFile = async () => {
    const s3 = new ReactS3Client(s3Config);
    const filename = edition.title.replace(/ /g, "");
    try {
      const res = await s3.uploadFile(edition.image as File, filename);
      return res.location;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className={styles.formEdition}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <h3>Admin</h3>
        <div className={styles.formGroup}>
          <Form.Label>Image</Form.Label>
          <Form.Control
            required
            type="file"
            onChange={({ target }: { target: any }) =>
              setEdition({ ...edition, image: target.files[0] })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label>Artist</label>
          <Form.Control
            required
            type="text"
            name="artist"
            placeholder="Enter artist"
            onChange={({ target }: { target: any }) =>
              setEdition({ ...edition, artist: target.value })
            }
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
            placeholder="Enter title"
            name="title"
            onChange={({ target }: { target: any }) =>
              setEdition({ ...edition, title: target.value })
            }
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
            as="textarea"
            rows={3}
            onChange={({ target }: { target: any }) =>
              setEdition({ ...edition, description: target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter description
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Categories</label>
          <Form.Select
            aria-label="Default select example"
            onChange={({ target }: { target: any }) =>
              setEdition({ ...edition, type: target.value })
            }
          >
            <option>Open this select menu</option>
            <option value="single">Single</option>
            <option value="album">Album</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please enter your confirmation password
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Supply</label>
          <Form.Control
            required
            type="string"
            placeholder="Enter supply"
            onChange={({ target }: { target: any }) =>
              setEdition({
                ...edition,
                supply: target.value.split(",").map(Number),
              })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter supply
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Categories</label>
          <Form.Control
            required
            type="text"
            placeholder="Diamond, gold, etc..."
            onChange={({ target }: { target: any }) =>
              setEdition({ ...edition, categories: target.value.split(",") })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter supply
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Base uri</label>
          <Form.Control
            required
            type="text"
            placeholder="ipfs://cid, etc..."
            onChange={({ target }: { target: any }) =>
              setEdition({ ...edition, baseUri: target.value.split(",") })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter baseURI
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Price</label>
          <Form.Control
            required
            type="text"
            placeholder="100, 100, etc..."
            onChange={({ target }: { target: any }) =>
              setEdition({
                ...edition,
                price: target.value.split(",").map(Number),
              })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter price
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Percentages</label>
          <Form.Control
            required
            type="text"
            placeholder="50,50, etc..."
            onChange={({ target }: { target: any }) =>
              setEdition({
                ...edition,
                percentages: target.value.split(",").map(Number),
              })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter percentages
          </Form.Control.Feedback>
        </div>
        <Button type="submit">
          {isLoading ? (
            <Spinner animation="border" className="#fff" />
          ) : (
            "Create collection"
          )}
        </Button>
        <div>{isConfirmed && <p> ✅ Contract deployed : {address} </p>}</div>
      </Form>
    </div>
  );
};

export default FormEdition;
