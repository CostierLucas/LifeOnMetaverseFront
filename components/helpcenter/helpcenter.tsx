import styles from "./helpcenter.module.scss";
import Link from "next/link";

const HelpCenter: React.FC = () => {
  return (
    <section className={styles.helpcenter}>
      <h3> Help Center</h3>

      <a
        className="btnLearnMore"
        href="https://lifeonmetaverse.gitbook.io/faq-life-on-metaverse/"
      >
        Learn More
      </a>
    </section>
  );
};

export default HelpCenter;
