import styles from "./helpcenter.module.scss";

const HelpCenter: React.FC = () => {
  return (
    <section className={styles.helpcenter}>
      <h3> Help Center</h3>
      <a>Learn More</a>
    </section>
  );
};

export default HelpCenter;
