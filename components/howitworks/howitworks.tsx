import styles from "./howitworks.module.scss";
import img from "../../assets/images/banniere.jpeg";
import platine from "../../assets/images/platine.jpg";
import casque from "../../assets/images/casque.jpg";
import pionner from "../../assets/images/pioneer.jpg";
import Image from "next/image";
import { Col, Container, Row } from "react-bootstrap";
import rect from "../../assets/images/rectangle_gradiant.png";

const Howitworks: React.FC = () => {
  return (
    <section className={styles.howitworks}>
      <Container>
        <h2>
          How <Image src={rect} width={60} height={12} /> it works ?
        </h2>
        <Row>
          <Col md={4} className="mb-5">
            <div className={styles.box}>
              <div className={styles.boxImage}>
                <Image src={platine} layout="fill" objectFit="cover" />
              </div>
              <div className={styles.boxContent}>
                <h3>Invest in Music</h3>
                <p>
                  You buy NFTs with music ownership and additional Artist
                  benefits.
                </p>
              </div>
            </div>
          </Col>
          <Col md={4} className="mb-5">
            <div className={styles.box}>
              <div className={styles.boxImage}>
                <Image src={casque} layout="fill" objectFit="cover" />
              </div>
              <div className={styles.boxContent}>
                <h3>People Stream your Music</h3>
                <p>
                  When fans listen to your music through the Digital Streaming
                  Platform, it generates royalties
                </p>
              </div>
            </div>
          </Col>
          <Col md={4} className="mb-5">
            <div className={styles.box}>
              <div className={styles.boxImage}>
                <Image src={pionner} layout="fill" objectFit="cover" />
              </div>
              <div className={styles.boxContent}>
                <h3>Artist and Fan Share Royalties</h3>
                <p>As co-owner with the artist, you earn royalties</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Howitworks;
