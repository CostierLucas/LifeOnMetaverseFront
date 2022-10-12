import styles from "./artist.module.scss";
import rectW from "../../assets/images/rectangle_white.png";
import Image from "next/image";
import Link from "next/link";

const Artist: React.FC = () => {
  return (
    <section className={styles.artist}>
      <h3>
        Are you an <Image src={rectW} width={60} height={12} /> Artist ?{" "}
      </h3>
      <Link href="request-artist">
        <a className="btnLearnMore">Learn More</a>
      </Link>
    </section>
  );
};

export default Artist;
