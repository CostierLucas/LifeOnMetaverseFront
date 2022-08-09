import styles from "./artist.module.scss";

const Artist: React.FC = () => {
  return (
    <section className={styles.artist}>
      <h3> Are you an Artist ? </h3>
      <a>Learn More</a>
    </section>
  );
};

export default Artist;
