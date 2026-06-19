import React, { useEffect, useState } from "react";
import { Container, Image, Spinner, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import BlogAuthor from "../blog-author/BlogAuthor";
import CommentsArea from "../../comments/CommentsArea";

const BlogPost = () => {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/blogPosts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setPost(data.blogPost);
        } else {
          setIsError(true);
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (isError || !post) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Post non trovato o errore del server.</Alert>
      </Container>
    );
  }

  const authorName =
    `${post.author?.firstName || ""} ${post.author?.lastName || ""}`.trim() ||
    "Autore sconosciuto";
  const authorAvatar =
    post.author?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;

  return (
    <Container className="mt-5">
      <h1 className="mb-4">{post.title}</h1>

      <div className="d-flex align-items-center mb-4">
        <BlogAuthor name={authorName} avatar={authorAvatar} />
        <span className="ms-3 text-muted">
          Tempo di lettura: {post.readTime?.value} {post.readTime?.unit}
        </span>
      </div>

      <Image
        src={post.cover}
        fluid
        className="w-100 rounded mb-4"
        style={{ maxHeight: "500px", objectFit: "cover" }}
      />

      <div
        className="blog-content mb-5"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>

      <hr />

      <div className="comments-section mt-5">
        <h3>Commenti</h3>
        <CommentsArea postId={post._id} />
      </div>
    </Container>
  );
};

export default BlogPost;
