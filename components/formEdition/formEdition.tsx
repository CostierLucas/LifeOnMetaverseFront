import { Button, Form } from "react-bootstrap";
import styles from "./formEdition.module.scss";
import { contractAddress } from "../../WalletHelpers/contractVariables";
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
  price: Array<string>;
  percentages: Array<number>;
  imagesNft: Array<File>;
  image: File | null;
  banner: File | null;
  prevState: null;
  titleList: Array<Array<string>>;
  royalty: number;
  percentagesInvestor: number;
  percentagesArtist: number;
  percentagesInvestorOpensea: number;
  percentagesArtistOpensea: number;
  artistWallet: string;
  spotify: string;
  startDate: number | null;
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
    imagesNft: [],
    image: null,
    banner: null,
    prevState: null,
    titleList: [],
    royalty: 0,
    percentagesInvestor: 0,
    percentagesArtist: 0,
    percentagesInvestorOpensea: 0,
    percentagesArtistOpensea: 0,
    artistWallet: "",
    spotify: "",
    startDate: null,
  });
  const [imageUrl, setImageUrl] = useState<string[]>([]);
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
      percentagesInvestor,
      percentagesArtist,
      percentagesArtistOpensea,
      percentagesInvestorOpensea,
      artistWallet,
      spotify,
      startDate,
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
      supply.length !== categories.length
    ) {
      e.stopPropagation();
      setIsLoading(false);
      return;
    } else {
      let baseUri = await generateMetadata();
      let addressDeployed = await deployContract(baseUri as any[]);
      let urlImage = await uploadFile();
      if (baseUri && addressDeployed && urlImage) {
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
            percentagesInvestor,
            percentagesArtist,
            percentagesArtistOpensea,
            percentagesInvestorOpensea,
            artistWallet,
            spotify,
            startDate,
          }),
        });
        setAddress(addressDeployed);
        setIsConfirmed(true);
      }
    }
    setIsLoading(false);
  };

  const deployContract = async (baseUri: any[]) => {
    const getSigner = provider.getSigner();
    const contractt = new ethers.Contract(
      contractAddress,
      Contract.abi,
      getSigner
    );
    console.log(edition);
    try {
      let transaction = await contractt.getBytecode(
        edition.categories,
        baseUri,
        edition.price,
        edition.supply,
        edition.percentages,
        contractUsdc,
        edition.artistWallet,
        account,
        [edition.percentagesInvestor, edition.percentagesArtist],
        [edition.percentagesInvestorOpensea, edition.percentagesArtistOpensea],
        edition.startDate
      );

      let deploy = await contractt.deploy(transaction, 11);
      await deploy.wait();
      const address = await contractt.getAddress(transaction, 11);
      return address;
    } catch (e: any) {
      console.log(e);
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
      console.log(e);
      return false;
    }
  };

  const uploadImageNft = async () => {
    const s3 = new ReactS3Client(s3Config);
    let imageUrl = [];

    try {
      for (let i = 0; i < edition.imagesNft.length; i++) {
        const filename = edition.title + "_" + edition.imagesNft[i].name;
        const image = await s3.uploadFile(edition.imagesNft[i], filename);
        imageUrl.push(image.location);
      }

      return imageUrl;
    } catch (e) {
      console.log(e);
    }
  };

  const generateMetadata = async () => {
    const s3 = new ReactS3Client(s3Config);
    const { title, description } = edition;
    let finalBaseUri = [];

    try {
      const imageUrl = await uploadImageNft();

      for (let i = 0; i < edition.categories.length; i++) {
        let object = {
          description: description,
          external_url: "https://google.com",
          name: `${title} #${i + 1}`,
          image: imageUrl![i],
        };

        let metadata = JSON.stringify(object);
        const filename =
          "Drops/" +
          edition.title +
          "_" +
          edition.categories[i] +
          "-" +
          Date.now();
        const file = new File([metadata], filename, {
          type: "application/json",
        });

        const upload = await s3.uploadFile(file, filename);
        finalBaseUri.push(upload.location);
      }

      return finalBaseUri;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const addTitle = (index: number) => {
    const newTitle = [...edition.titleList];
    if (subTitle === "") return;
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
            accept="image/png, image/jpeg"
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
            accept="image/png, image/jpeg"
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
            <option value="Single">Single</option>
            <option value="Album">Album</option>
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
            min="0"
            name="royalties"
            onWheel={(event) => event.currentTarget.blur()}
            onChange={({ target }: { target: any }) =>
              setEdition({ ...edition, royalty: target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter royalties
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Start date</label>
          <Form.Control
            required
            type="datetime-local"
            placeholder="start date"
            name="startDate"
            onChange={({ target }: { target: any }) => {
              const timestamp = new Date(target.value).getTime() / 1000;
              setEdition({ ...edition, startDate: timestamp });
            }}
          />
          <Form.Control.Feedback type="invalid">
            Please enter spotify link
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Percentages investor %</label>
          <Form.Control
            required
            type="number"
            placeholder="0"
            min="0"
            name="percentages"
            onWheel={(event) => event.currentTarget.blur()}
            onChange={({ target }: { target: any }) =>
              setEdition({ ...edition, percentagesInvestor: target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter percentages
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Percentages artist %</label>
          <Form.Control
            required
            type="number"
            placeholder="0"
            min="0"
            name="percentages"
            onWheel={(event) => event.currentTarget.blur()}
            onChange={({ target }: { target: any }) =>
              setEdition({ ...edition, percentagesArtist: target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter percentages
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Percentages artist Opensea %</label>
          <Form.Control
            required
            type="number"
            placeholder="0"
            min="0"
            name="percentages"
            onWheel={(event) => event.currentTarget.blur()}
            onChange={({ target }: { target: any }) =>
              setEdition({ ...edition, percentagesArtistOpensea: target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter percentages
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Percentages investor Opensea %</label>
          <Form.Control
            required
            type="number"
            placeholder="0"
            min="0"
            name="percentages"
            onWheel={(event) => event.currentTarget.blur()}
            onChange={({ target }: { target: any }) =>
              setEdition({
                ...edition,
                percentagesInvestorOpensea: target.value,
              })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter percentages
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Wallet artist</label>
          <Form.Control
            required
            type="text"
            placeholder="0x..."
            name="artistWallet"
            onChange={({ target }: { target: any }) =>
              setEdition({ ...edition, artistWallet: target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter title
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
                <Accordion.Header>Categorie #{index + 1}</Accordion.Header>
                <Accordion.Body>
                  <div className={styles.formGroup}>
                    <label>Supply</label>
                    <Form.Control
                      required
                      type="number"
                      min="0"
                      placeholder="Enter supply"
                      onWheel={(event) => event.currentTarget.blur()}
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
                    <label>Image nft</label>
                    <Form.Control
                      required
                      type="file"
                      accept="image/png, image/jpeg, video/mp4"
                      onChange={({ target }: { target: any }) =>
                        setEdition((prevState) => {
                          const newImage = { ...prevState };
                          newImage.imagesNft[index] = target.files[0];
                          return newImage;
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
                      type="number"
                      min="0"
                      placeholder="100"
                      onWheel={(event) => event.currentTarget.blur()}
                      onChange={({ target }: { target: any }) => {
                        if (target.value !== "") {
                          let parsePrice = ethers.utils
                            .parseEther(target.value)
                            .toString();
                          setEdition((prevState) => {
                            const newPrice = { ...prevState };
                            newPrice.price[index] = parsePrice;
                            return newPrice;
                          });
                        }
                      }}
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
                      placeholder="50"
                      min="0"
                      onWheel={(event) => event.currentTarget.blur()}
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
                    <label>List extra</label>
                    <Form.Control
                      value={subTitle}
                      type="text"
                      placeholder="Exclusive access to an unreleased mix of the song..."
                      onChange={({ target }: { target: any }) => {
                        setSubTitle(target.value);
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter extra
                    </Form.Control.Feedback>
                    <Button
                      className={styles.btnAddTitle}
                      onClick={() => addTitle(index)}
                    >
                      Add Extra
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
