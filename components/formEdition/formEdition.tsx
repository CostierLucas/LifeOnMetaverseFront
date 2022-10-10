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
import Accordion from "react-bootstrap/Accordion";

interface IEdition {
  artist: string;
  title: string;
  description: string;
  type: string;
  supply: Array<number>;
  categories: Array<string>;
  baseUri: Array<string>;
  price: Array<number>;
  percentages: Array<number>;
  image: File | null;
  banner: File | null;
  prevState: null;
  titleList: Array<Array<string>>;
  royalty: number;
  spotify: string;
}

const FormEdition: React.FC = () => {
  const context = useWeb3React<any>();
  const { account, provider, chainId } = context;
  const [isIndex, setIsIndex] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [address, setAddress] = useState("");
  const [edition, setEdition] = useState<IEdition>({
    artist: "",
    title: "",
    description: "",
    type: "single",
    supply: [],
    categories: [],
    baseUri: [],
    price: [],
    percentages: [],
    image: null,
    banner: null,
    prevState: null,
    titleList: [],
    royalty: 0,
    spotify: "",
  });
  const [validated, setValidated] = useState(false);
  const [subTitle, setSubTitle] = useState<string>("");

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
      image,
      banner,
      titleList,
      royalty,
      spotify,
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
            image: urlImage.image,
            banner: urlImage.banner,
            titleList,
            royalty,
            spotify,
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
        account,
        account
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
    const filenameBanner = edition.title.replace(/ /g, "") + "_banner";

    try {
      const image = await s3.uploadFile(edition.image as File, filename);
      const banner = await s3.uploadFile(
        edition.banner as File,
        filenameBanner
      );

      return {
        image: image.location,
        banner: banner.location,
      };
    } catch (e) {
      return false;
    }
  };

  const addTitle = (index: number) => {
    const newTitle = [...edition.titleList];
    if (newTitle[index] === undefined) {
      newTitle.push([subTitle]);
    } else {
      newTitle[index].push(subTitle);
    }
    setEdition({ ...edition, titleList: newTitle });
    setSubTitle("");
  };

  return (
    <div className={styles.formEdition}>
      <h3>Add edition</h3>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <Form.Label>Banner</Form.Label>
          <Form.Control
            required
            type="file"
            onChange={({ target }: { target: any }) =>
              setEdition({ ...edition, banner: target.files[0] })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <Form.Label>Image</Form.Label>
          <Form.Control
            required
            type="file"
            onChange={({ target }: { target: any }) => {
              setEdition({ ...edition, image: target.files[0] });
            }}
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
            <option value="single">Single</option>
            <option value="album">Album</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please choose categories
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Royalties %</label>
          <Form.Control
            required
            type="number"
            placeholder="0"
            name="royalties"
            onChange={({ target }: { target: any }) =>
              setEdition({ ...edition, royalty: target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter royalties
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Spotify</label>
          <Form.Control
            required
            type="text"
            placeholder="Enter spotify link"
            name="spotify"
            onChange={({ target }: { target: any }) =>
              setEdition({ ...edition, spotify: target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter spotify link
          </Form.Control.Feedback>
        </div>
        <Button
          className={styles.btnCategorie}
          onClick={() => setIsIndex([...isIndex, {}])}
        >
          Add Categorie
        </Button>
        <div className={styles.accordion}>
          {isIndex.map((item, index) => (
            <Accordion defaultActiveKey="0" key={index}>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Categorie #{index}</Accordion.Header>
                <Accordion.Body>
                  <div className={styles.formGroup}>
                    <label>Supply</label>
                    <Form.Control
                      required
                      type="number"
                      placeholder="Enter supply"
                      onChange={({ target }: { target: any }) =>
                        setEdition((prevState) => {
                          const newSupply = { ...prevState };
                          newSupply.supply[index] = target.value;
                          return newSupply;
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
                      placeholder="Diamond"
                      onChange={({ target }: { target: any }) =>
                        setEdition((prevState) => {
                          const newCategorie = { ...prevState };
                          newCategorie.categories[index] = target.value;
                          return newCategorie;
                        })
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
                        setEdition((prevState) => {
                          const newBaseUri = { ...prevState };
                          newBaseUri.baseUri[index] = target.value;
                          return newBaseUri;
                        })
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
                        setEdition((prevState) => {
                          const newPrice = { ...prevState };
                          newPrice.price[index] = target.value;
                          return newPrice;
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
                      type="number"
                      placeholder="50,50, etc..."
                      onChange={({ target }: { target: any }) =>
                        setEdition((prevState) => {
                          const newPercentage = { ...prevState };
                          newPercentage.percentages[index] = target.value;
                          return newPercentage;
                        })
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter percentages
                    </Form.Control.Feedback>
                  </div>
                  <div className={styles.formGroup}>
                    <label>List title</label>
                    <Form.Control
                      value={subTitle}
                      type="text"
                      placeholder="Exclusive access to an unreleased mix of the song..."
                      onChange={({ target }: { target: any }) =>
                        setSubTitle(target.value)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter list
                    </Form.Control.Feedback>
                    <Button
                      className={styles.btnAddTitle}
                      onClick={() => addTitle(index)}
                    >
                      Add title
                    </Button>
                    <ul className={styles.listTitle}>
                      {edition.titleList[index] !== undefined &&
                        edition.titleList[index].map((item, index) => (
                          <li key={item}>{item}</li>
                        ))}
                    </ul>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          ))}
        </div>
        <Button type="submit">
          {isLoading ? (
            <Spinner animation="border" className="#fff" />
          ) : (
            "Create collection"
          )}
        </Button>
      </Form>
      <div>{isConfirmed && <p> ✅ Contract deployed : {address} </p>}</div>
    </div>
  );
};

export default FormEdition;
