import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Container, Form, InputGroup, Button } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";

const Home = (props) => {
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("author");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedAuthor = localStorage.getItem("author");

    if (token && savedAuthor) {
      try {
        const decodedToken = jwtDecode(token);
        const isExpired = decodedToken.exp * 1000 < Date.now();

        if (isExpired) {
          alert("La tua sessione è scaduta. Effettua di nuovo l'acceso!");
          handleLogout();
        } else {
          setAuthor(JSON.parse(savedAuthor));
        }
      } catch (e) {
        handleLogout();
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchPosts = async (query = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:9099/blogPosts?page=1&pageSize=10&title=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setPosts(data.blogPosts);
      } else {
        const errorData = await response.json();
        console.log("Errore di risposta del server");
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(searchQuery);
  };
  return (
    <Container fluid="sm">
      {author ? (
        <h1 className="blog-main-title mb-4 mt-4 text-center">
          Ciao {author.firstName}! Benvenuto sullo Strive Blog!
        </h1>
      ) : (
        <h1>Caricamento in corso...</h1>
      )}
      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Cerca un articolo per titolo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="dark" type="submit">
            Cerca
          </Button>
        </InputGroup>
      </Form>
      <BlogList posts={posts} />
    </Container>
  );
};

export default Home;
