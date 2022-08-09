import styles from "./showcase.module.scss";
import img from "../../assets/images/banniere.jpeg";
import Image from "next/image";
import { Container } from "react-bootstrap";

const Showcase: React.FC = () => {
  return (
    <section className={styles.showcase}>
      <div className={styles.showcaseImg}>
        <Image src={img} layout="fill" objectFit="cover" />
      </div>
      <div className={styles.showcaseFilter}></div>
      <Container>
        <div className={styles.showcaseText}>
          <p>5.000 TOKENS / 1% ALBUM OWNERSHIP</p>
          <hr />
          <h2>
            The Chainsmokers <br />
            "So Far So Good"
          </h2>
          <button>Learn more</button>
        </div>
      </Container>
    </section>
  );
};

export default Showcase;
