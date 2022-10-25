import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./footer.module.scss";
import Link from "next/link";

const footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <Container fluid>
        <Row>
          <Col md={3}>
            <div className={styles.footerImg}>
              <Image src="/lom.png" alt="logo" width={200} height={70} />
            </div>
          </Col>
          <Col md={3}>
            <ul>
              <li>
                <a
                  href="https://lifeonmetaverse.gitbook.io/faq-life-on-metaverse/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Help Center
                </a>
              </li>
              <li>
                <Link href="/support">Support</Link>
              </li>
            </ul>
          </Col>
          <Col md={3}>
            <ul>
              <li>
                <a href="https://twitter.com/LifeOnMetavers">Twitter</a>
              </li>
              <li>
                <a href="https://www.youtube.com/channel/UCbOJT4XKq7-SOGoSwyUe4Rg">
                  Youtube
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/lifeonmetaverse/">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@lifeonmetaverse">TikTok</a>
              </li>
              <li>
                <a href="https://discord.gg/UA9GNqWy">Discord</a>
              </li>
            </ul>
          </Col>
          <Col md={3}>
            <ul>
              <li>
                <Link href="/terms">Terms of Service</Link>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default footer;
