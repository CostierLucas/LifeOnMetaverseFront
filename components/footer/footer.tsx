import logo from "../../assets/images/logo.jpg";
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
            <Image src="/logo.jpg" alt="logo" width={200} height={70} />
          </Col>
          <Col md={3}>
            <ul>
              <li>
                <Link href="/helpcenter">Help Center</Link>
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
                <a href="https://discord.com/invite/mASJakvuzh">Discord</a>
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
