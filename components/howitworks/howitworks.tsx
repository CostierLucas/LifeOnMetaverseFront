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
              <div className={styles.contentBox}>
                <Image src={platine} layout="fill" objectFit="cover" />
                <div className={styles.contentBoxTextOne}>
                  <h3>
                    Invest
                    <br />
                    in Music
                  </h3>
                  <p>
                    When fans listen to your music through the Digital Streaming
                    Platform, it generates royalties
                  </p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={4} className="mb-5">
            <div className={styles.box}>
              <div className={styles.contentBox}>
                <Image src={casque} layout="fill" objectFit="cover" />
                <div className={styles.contentBoxTextTwo}>
                  <h3>
                    People <br /> Stream <br /> your Music
                  </h3>
                  <p>
                    When fans listen to your music through the Digital Streaming
                    Platform, it generates royalties
                  </p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div className={styles.box}>
              <div className={styles.contentBox}>
                <Image src={pionner} layout="fill" objectFit="cover" />
                <div className={styles.contentBoxTextThree}>
                  <h3>
                    Artist <br />
                    and Fan
                    <br />
                    Share <br />
                    Royalties
                  </h3>
                  <p>
                    When fans listen to your music through the Digital Streaming
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* <Row>
          <Col md={4}>
            <div className={styles.howitworksItem}>
              <div className={styles.howitworksItemImg}>
                <Image src={platine} layout="fill" objectFit="cover" />
              </div>
              <div className={styles.howitworksItemText}>
                <h3 className={styles.howitworksItemTextOne}>
                  Invest
                  <br />
                  in Music
                </h3>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className={styles.howitworksItem}>
              <div className={styles.howitworksItemImg}>
                <Image src={casque} layout="fill" objectFit="cover" />
              </div>
              <div className={styles.howitworksItemText}>
                <h3 className={styles.howitworksItemTextTwo}>
                  People <br /> Stream <br /> your Music
                </h3>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className={styles.howitworksItem}>
              <div className={styles.howitworksItemImg}>
                <Image src={pionner} layout="fill" objectFit="cover" />
              </div>
              <div className={styles.howitworksItemText}>
                <h3 className={styles.howitworksItemTextThree}>
                  Artist <br />
                  and Fan
                  <br />
                  Share <br />
                  Royalties
                </h3>
              </div>
            </div>
          </Col>
        </Row> */}
      </Container>
    </section>
  );
};

export default Howitworks;
