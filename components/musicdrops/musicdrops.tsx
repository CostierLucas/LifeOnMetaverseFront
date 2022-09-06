import styles from "./musicdrops.module.scss";
import img from "../../assets/images/banniere.jpeg";
import Image from "next/image";
import { Col, Container, Row } from "react-bootstrap";
import { IEdition } from "../../interfaces/interfaces";
import Link from "next/link";

const MusicDrops: React.FC<{ edition: IEdition }> = ({ edition }) => {
  return (
    <section className={styles.musicdrops}>
      <Container>
        <h2>Music Drops</h2>
        <Row>
          {edition.map((item: IEdition, i: number) => {
            if (i == 0) {
              return <div key={i}></div>;
            }
            return (
              <Col md={4} key={i}>
                <Link href={`/editions/${item.date}`} passHref>
                  <div className={styles.musicdropsItem}>
                    <div className={styles.musicdropsItemImg}>
                      <Image
                        src={edition[i].image as string}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className={styles.musicdropsItemBloc}>
                      <div className={styles.musicdropsItemBlocToken}>
                        <p>
                          {edition[i].supply.reduce(
                            (a: any, b: any) => parseInt(a) + parseInt(b)
                          )}{" "}
                          TOKENS
                        </p>
                      </div>
                      <div className={styles.musicdropsItemBlocTitle}>
                        <h3>{edition[i].title}</h3>
                        <p>{edition[i].artist}</p>
                        <p>- {edition[i].categorie_selected} -</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};

export default MusicDrops;
