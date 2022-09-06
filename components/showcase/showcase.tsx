import { useState } from "react";
import styles from "./showcase.module.scss";
import img from "../../assets/images/banniere.jpeg";
import Image from "next/image";
import { Container } from "react-bootstrap";
import { IEdition } from "../../interfaces/interfaces";
import Link from "next/link";
import { useEffect } from "react";

const Showcase: React.FC<{ edition: IEdition }> = ({ edition }) => {
  // useEffect(() => {
  //   console.log(edition[0].r);

  return (
    <section className={styles.showcase}>
      <div className={styles.showcaseImg}>
        <Image src={edition[0].banner} layout="fill" objectFit="cover" />
      </div>
      <div className={styles.showcaseFilter}></div>
      <Container>
        <div className={styles.showcaseText}>
          <p>
            {edition[0].supply.reduce(
              (a: any, b: any) => parseInt(a) + parseInt(b)
            )}{" "}
            TOKENS / 35% ALBUM OWNERSHIP
          </p>
          <hr />
          <h2>
            {edition[0].artist} <br />"{edition[0].title}"
          </h2>
          <Link href={`/editions/${edition[0].date}`}>
            <a>Learn more</a>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default Showcase;
