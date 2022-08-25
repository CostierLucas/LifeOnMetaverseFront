import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import styles from "./header.module.scss";
import Image from "next/image";
import logo from "../../assets/images/logo.jpg";
import Link from "next/link";
import { useSession, getSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import React from "react";
import ConnectWallet from "../ConnectWallet/ConnectWallet";

const Header: React.FC = () => {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className={styles.header}>
      <Navbar collapseOnSelect expand="lg">
        <Container fluid>
          <Navbar.Brand className={styles.headerLogo}>
            <Link href="/">
              <Image src={logo} alt="logo" width={200} height={70} />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end align-items-center"
          >
            <Nav className="align-items-center">
              {status === "unauthenticated" ? (
                <>
                  <Link href="/auth">LOGIN</Link>
                  <Link href="#">
                    <Nav.Link>|</Nav.Link>
                  </Link>
                  <Link href="/auth/register">SIGN UP</Link>
                </>
              ) : (
                <>
                  <Nav.Link>DASHBOARD</Nav.Link>
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="none">
                      <Image
                        className={styles.avatar}
                        src={logo}
                        alt="logo"
                        width={40}
                        height={40}
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {session?.role == "admin" && (
                        <>
                          <Dropdown.Item passHref className={styles.link}>
                            <Link href="/admin">
                              <a className={styles.link}> Admin</a>
                            </Link>
                          </Dropdown.Item>
                          <Dropdown.Divider />
                        </>
                      )}
                      <Dropdown.Item>
                        <ConnectWallet />
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleSignOut} href="#">
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
