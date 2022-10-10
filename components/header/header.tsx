import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import styles from "./header.module.scss";
import Image from "next/image";
import logoo from "../../assets/images/logo.jpg";
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
          <Link href="/">
            <Navbar.Brand className={styles.headerLogo}>
              <Image src="/logo.jpg" alt="logo" width={200} height={70} />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end align-items-center"
          >
            <Nav className="align-items-center">
              {status === "unauthenticated" ? (
                <>
                  <Link href="/auth">
                    <a>LOGIN</a>
                  </Link>
                  <Link href="#">
                    <Nav.Link>|</Nav.Link>
                  </Link>
                  <Link href="/auth/register">SIGN UP</Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard">
                    <a className={styles.link}> DASHBOARD </a>
                  </Link>
                  <ConnectWallet />
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="none">
                      <Image
                        className={styles.avatar}
                        src="/logo.jpg"
                        alt="logo"
                        width={40}
                        height={40}
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {session?.role == "admin" && (
                        <>
                          {/* <Dropdown.Item className={styles.link}> */}
                          <Link href="/admin">
                            <a className={styles.link}> Admin</a>
                          </Link>
                          {/* </Dropdown.Item> */}
                          <Dropdown.Divider />
                        </>
                      )}
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
