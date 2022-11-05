import styles from "./musicdrops.module.scss";
import Image from "next/image";
import { Col, Container, Row } from "react-bootstrap";
import { IEdition } from "../../interfaces/interfaces";
import Link from "next/link";

const MusicDrops: React.FC<{ edition: IEdition }> = ({ edition }) => {
  return (
    <section className={styles.musicdrops}>
      <Container>
        <h2>Previews Drops</h2>
        <Row>
          {edition.map((item: IEdition, i: number) => {
            if (i == 0) {
              return <div key={i}></div>;
            }
            return (
              <Col md={4} key={i} className="pt-4 ">
                <Link href={`/editions/${item.date}`} passHref>
                  <div>
                    <div className={styles.cardEntire}>
                      <div className={styles.cardImg}>
                        <Image
                          layout="fill"
                          objectFit="cover"
                          src={edition[i].image as string}
                          className="card-img-top"
                          style={{ width: "100%" }}
                          alt="cover"
                        />
                      </div>

                      <div className={styles.cardBody}>
                        <div className="card-body p-0">
                          <div className={styles.cardBodyTokens}>
                            <p>
                              {edition[i].supply.reduce(
                                (a: any, b: any) => parseInt(a) + parseInt(b)
                              )}{" "}
                              TOKENS
                            </p>
                          </div>
                          <div className={styles.cardBodyDescription}>
                            <p className={styles.cardBodyTitle}>
                              {edition[i].title.toUpperCase()}
                            </p>
                            <p className={styles.cardBodyArtist}>
                              {edition[i].artist}
                            </p>
                            <p className={styles.cardBodyCategorie}>
                              - {edition[i].categorie_selected} -
                            </p>
                          </div>
                        </div>
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
