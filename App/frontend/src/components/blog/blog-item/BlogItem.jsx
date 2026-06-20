import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import BlogAuthor from "../blog-author/BlogAuthor";
import "./styles.css";
const BlogItem = (props) => {
  const { title, cover, author, _id } = props;
  let authorName = "Autore Sconosciuto";
  let authorAvatar =
    "https://ui-avatars.com/api/?name=User&background=333&color=fff";

  if (author && typeof author === "object") {
    authorName =
      `${author.firstName || ""} ${author.lastName || ""}`.trim() ||
      "Autore Sconosciuto";
    authorAvatar =
      author.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;
  } else if (typeof author === "string") {
    authorName = "Utente (ID Vecchio)";
  }
  return (
    <Link to={`/blog/${_id}`} className="blog-link">
      <Card className="blog-card">
        <Card.Img variant="top" src={cover} className="blog-cover" />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
        </Card.Body>
        <Card.Footer>
          <BlogAuthor name={authorName} avatar={authorAvatar} />
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default BlogItem;
