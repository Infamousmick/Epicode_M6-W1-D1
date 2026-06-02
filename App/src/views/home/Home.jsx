import React, { useState, useEffect } from "react";
import { Container, Form, InputGroup, Button } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";

const Home = (props) => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = async (query = "") => {
    try {
      const response = await fetch(
        `http://localhost:9099/blogPosts?page=1&pageSize=10&title=${searchQuery}`,
      );

      if (response.ok) {
        const data = await response.json();
        setPosts(data.blogPosts);
        console.log("Dati recuperati con successo", data.blogPosts);
      } else {
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
      <h1 className="blog-main-title mb-3">Benvenuto sullo Strive Blog!</h1>
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
