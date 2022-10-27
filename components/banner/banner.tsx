import styles from "./banner.module.scss";
import rect from "../../assets/images/rectangle_gradiant.png";
import Image from "next/image";

const Banner: React.FC = () => {
  return (
    <section className={styles.banner}>
      <div>
        <h1>
          Invest <Image src={rect} alt="rectangle" width={60} height={12} />{" "}
          Music Royalties
        </h1>
      </div>
    </section>
  );
};

export default Banner;
