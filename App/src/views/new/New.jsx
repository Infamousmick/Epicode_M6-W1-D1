import React, { useCallback, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./styles.css";
// import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

const NewBlogPost = (props) => {
  const [text, setText] = useState("");

  const handleChange = useCallback((value) => {
    setText(draftToHtml(value));
  }, []);

  const [form, setForm] = useState({});

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm({
      ...form,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      title: form.title || "Titolo Senza Nome",
      category: form.category || "Tech",
      content: text,
      cover: "https://picsum.photos/800/400",
      readTime: {
        value: 2,
        unit: "minuti",
      },
      author: "mario.rossi@epicode.com",
    };

    try {
      const response = await fetch("http://localhost:9099/blogPosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        alert("Articolo creato con successo!");
      } else {
        alert(
          "Errore nella creazione. Sicuro che il titolo sia sotto i 20 caratteri?",
        );
      }
    } catch (error) {
      console.error("Errore di rete:", error);
    }
  };

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSubmit}>
        <Form.Group controlId="title" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Title"
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="category" className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control size="lg" as="select" onChange={handleInputChange}>
            <option>Tech</option>
            <option>News</option>
            <option>Lifestyle</option>
            <option>Coding</option>
            <option>Modding</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Contenuto Blog</Form.Label>
          <Editor
            value={text}
            onChange={handleChange}
            className="new-blog-content"
          />
        </Form.Group>

        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{
              marginLeft: "1em",
            }}
          >
            Invia
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;
