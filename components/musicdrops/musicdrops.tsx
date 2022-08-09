import styles from "./musicdrops.module.scss";
import img from "../../assets/images/banniere.jpeg";
import Image from "next/image";
import { Col, Container, Row } from "react-bootstrap";

const MusicDrops: React.FC = () => {
  return (
    <section className={styles.musicdrops}>
      <Container>
        <h2>Music Drops</h2>
        <Row>
          <Col md={4}>
            <div className={styles.musicdropsItem}>
              <div className={styles.musicdropsItemImg}>
                <Image src={img} layout="fill" objectFit="cover" />
              </div>
              <div className={styles.musicdropsItemBloc}>
                <div className={styles.musicdropsItemBlocToken}>
                  <p>753 TOKENS</p>
                </div>
                <div className={styles.musicdropsItemBlocTitle}>
                  <h3>SO FAR SO GOOD</h3>
                  <p>DIPLO</p>
                  <p>- Single -</p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className={styles.musicdropsItem}>
              <div className={styles.musicdropsItemImg}>
                <Image src={img} layout="fill" objectFit="cover" />
              </div>
              <div className={styles.musicdropsItemBloc}>
                <div className={styles.musicdropsItemBlocToken}>
                  <p>753 TOKENS</p>
                </div>
                <div className={styles.musicdropsItemBlocTitle}>
                  <h3>SO FAR SO GOOD</h3>
                  <p>DIPLO</p>
                  <p>- Single -</p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className={styles.musicdropsItem}>
              <div className={styles.musicdropsItemImg}>
                <Image src={img} layout="fill" objectFit="cover" />
              </div>
              <div className={styles.musicdropsItemBloc}>
                <div className={styles.musicdropsItemBlocToken}>
                  <p>753 TOKENS</p>
                </div>
                <div className={styles.musicdropsItemBlocTitle}>
                  <h3>SO FAR SO GOOD</h3>
                  <p>DIPLO</p>
                  <p>- Single -</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default MusicDrops;
