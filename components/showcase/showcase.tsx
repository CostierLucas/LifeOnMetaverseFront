import styles from "./showcase.module.scss";
import Image from "next/image";
import { Container } from "react-bootstrap";
import { IEdition } from "../../interfaces/interfaces";
import Link from "next/link";

const Showcase: React.FC<{ edition: IEdition }> = ({ edition }) => {
  return (
    <section className={styles.showcase}>
      <div className={styles.showcaseImg}>
        <Image src={edition[0].banner} layout="fill" objectFit="cover" />
      </div>
      <div className={styles.showcaseFilter}></div>
      <Container>
        <div className={styles.showcaseText}>
          <p className={styles.showcaseTextRecap}>
            {edition[0].supply.length !== 0 &&
              edition[0].supply.reduce(
                (a: any, b: any) => parseInt(a) + parseInt(b)
              )}{" "}
            TOKENS / 35% ALBUM OWNERSHIP
          </p>
          <hr />
          <h2>
            {edition[0].artist} <br />"{edition[0].title}"
          </h2>
          <div style={{ marginTop: "20px" }}>
            <Link href={`/editions/${edition[0].date}`}>
              <a className={styles.btnLearnMore}>LEARN MORE</a>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Showcase;
