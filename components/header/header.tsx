import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import Image from "next/image";
import logo from "../../assets/images/logo.jpg";

const Header: React.FC = () => {
  return (
    <Navbar collapseOnSelect expand="lg">
      <Container fluid>
        <Navbar.Brand>
          <Image src={logo} alt="logo" width={200} height={70} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end"
        >
          <Nav>
            <Nav.Link>DASHBOARD</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
