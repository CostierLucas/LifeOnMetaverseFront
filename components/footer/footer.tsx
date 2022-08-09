import logo from "../../assets/images/logo.jpg";
import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./footer.module.scss";

const footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <Container fluid>
        <Row>
          <Col md={5}>
            <Image src={logo} alt="logo" width={200} height={70} />
          </Col>
          <Col md={7}>
            <ul>
              <li>
                <a href="#">Support</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Twitter</a>
              </li>
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">Youtube</a>
              </li>
              <li>
                <a href="#">TikTok</a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default footer;
