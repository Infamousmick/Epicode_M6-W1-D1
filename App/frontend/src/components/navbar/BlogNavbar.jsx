import React from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import logo from "../../assets/logo.png";
import ProfileDropdown from "../profileDropdown/ProfileDrodown";
import "./styles.css";
const NavBar = (props) => {
  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>
        <div className="d-flex gap-2">
          {" "}
          <ProfileDropdown />
          <Button
            as={Link}
            to="/new"
            className="blog-navbar-add-button bg-dark"
            size="lg"
          >
            <Plus size={16} />
            Nuovo Articolo
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;
