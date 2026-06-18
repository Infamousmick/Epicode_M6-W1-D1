import React, { useCallback, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./styles.css";
// import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

const NewBlogPost = (props) => {
  const [text, setText] = useState("");
  const [form, setForm] = useState({});
  const [coverFile, setCoverFile] = useState(null);

  const handleChange = useCallback((value) => {
    setText(draftToHtml(value));
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm({
      ...form,
      [id]: value,
    });
  };
  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const authorString = localStorage.getItem("author");

      if (!token || !authorString) {
        alert("Devi fare il login per creare un post");
        return;
      }
      const authorObj = JSON.parse(authorString);

      const newPost = {
        title: form.title || "Titolo Senza Nome",
        category: form.category || "Tech",
        content: text,
        cover: "https://picsum.photos/800/400",
        readTime: {
          value: 2,
          unit: "minuti",
        },
        author: authorObj._id,
      };
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/blogPosts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        const data = await response.json();

        const newPostId = data.blogPost._id;

        if (coverFile) {
          const formData = new FormData();
          formData.append("cover", coverFile);

          const coverResponse = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/blogPosts/${newPostId}/cover`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            },
          );

          if (coverResponse.ok) {
            alert("Articolo e copertina creati con successo! 🎉");
          } else {
            alert("Articolo creato, ma c'è stato un errore con la foto.");
          }
        } else {
          alert("Articolo creato con successo (senza copertina)");
        }
      } else {
        const errorData = await response.json();
        alert("Errore dal Server: " + errorData.message);
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

        <Form.Group controlId="cover" className="mt-3">
          <Form.Label>Copertina Articolo</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
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
