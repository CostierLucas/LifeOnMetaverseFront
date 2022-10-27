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
          How <Image src={rect} alt="rectangle" width={60} height={12} /> it
          works ?
        </h2>
        <Row>
          <Col md={4} className="mb-5">
            <div>
              <div className={styles.box}>
                <div className={styles.contentBox}>
                  <h3 className={styles.contentBoxTextOne}>
                    Invest
                    <br />
                    in Music
                  </h3>
                </div>
              </div>{" "}
              <p>
                You buy NFTs with music ownership and additional Artist
                benefits.
              </p>
            </div>
          </Col>
          <Col md={4} className="mb-5">
            <div>
              <div className={styles.box}>
                <div className={styles.contentBox}>
                  <h3 className={styles.contentBoxTextTwo}>
                    People <br /> Stream <br /> your Music
                  </h3>
                </div>
              </div>
              <p>
                When fans listen to your music through the Digital Streaming
                Platform, it generates royalties
              </p>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div>
              <div className={styles.box}>
                <div className={styles.contentBox}>
                  <h3 className={styles.contentBoxTextThree}>
                    Artists <br />
                    and Fan
                    <br />
                    Share <br />
                    Royalties
                  </h3>
                </div>
              </div>
              <p>As co-owner with the artist, you earn royalties</p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Howitworks;
