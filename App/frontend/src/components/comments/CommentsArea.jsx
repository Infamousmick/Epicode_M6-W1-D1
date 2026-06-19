import React, { useCallback, useEffect, useState } from "react";
import { Form, Button, ListGroup, Spinner, Alert } from "react-bootstrap";

const CommentArea = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/blogPosts/${postId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      } else {
        setError("Errore nel caricamento dei commenti");
      }
    } catch (err) {
      setError("Errore di connessione");
    } finally {
      setLoading(false);
    }
  }, [postId]);


  useEffect(() => {
    fetchComments();
  }, [fetchComments]);


  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const savedAuthor = JSON.parse(localStorage.getItem("author") || "{}");
      const authorName =
        `${savedAuthor.firstName || ""} ${savedAuthor.lastName || ""}`.trim() ||
        savedAuthor.email ||
        "Utente";

      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/blogPosts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newComment, author: authorName }),
        },
      );

      if (response.ok) {
        setNewComment("");
        fetchComments();
      } else {
        alert("Errore nell'invio del commento");
      }
    } catch (err) {
      alert("Errore di connessione");
    }
  };

  if (loading) return <Spinner animation="border" size="sm" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <ListGroup className="mb-4">
        {comments.length === 0 ? (
          <ListGroup.Item>Nessun commento ancora. Scrivi il primo!</ListGroup.Item>
        ) : (
          comments.map((comment) => (
            <ListGroup.Item key={comment._id}>
              <strong>{comment.author}: </strong>
              {comment.text}
            </ListGroup.Item>
          ))
        )}
      </ListGroup>

      <Form onSubmit={handleAddComment}>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Scrivi un commento..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={!newComment.trim()}>
          Invia Commento
        </Button>
      </Form>
    </div>
  );
};

export default CommentArea;
