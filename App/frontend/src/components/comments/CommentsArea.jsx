import React, { useCallback, useEffect, useState } from "react";
import { Form, Button, ListGroup, Spinner, Alert } from "react-bootstrap";
import { Check, Edit3, Send, Trash2, X } from "lucide-react";

const CommentArea = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const savedAuthor = JSON.parse(localStorage.getItem("author") || "{}");
  const currentAuthorName =
    `${savedAuthor.firstName || ""} ${savedAuthor.lastName || ""}`.trim() ||
    savedAuthor.email ||
    "Utente";

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

      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/blogPosts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newComment, author: currentAuthorName }),
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

  const startEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.text);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/blogPosts/${postId}/comment/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: editingText,
            author: currentAuthorName,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setComments((currentComments) =>
          currentComments.map((comment) =>
            comment._id === commentId ? data.comment : comment,
          ),
        );
        cancelEditing();
      } else {
        alert("Errore nella modifica del commento");
      }
    } catch (err) {
      alert("Errore di connessione");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm("Vuoi eliminare questo commento?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/blogPosts/${postId}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setComments((currentComments) =>
          currentComments.filter((comment) => comment._id !== commentId),
        );
      } else {
        alert("Errore nell'eliminazione del commento");
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
            <ListGroup.Item
              key={comment._id}
              className="d-flex justify-content-between align-items-start gap-3"
            >
              <div className="flex-grow-1">
                <strong>{comment.author}: </strong>
                {editingCommentId === comment._id ? (
                  <Form.Control
                    as="textarea"
                    rows={2}
                    className="mt-2"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                ) : (
                  <span>{comment.text}</span>
                )}
              </div>

              {comment.author === currentAuthorName && (
                <div className="d-flex gap-2">
                  {editingCommentId === comment._id ? (
                    <>
                      <Button
                        type="button"
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleUpdateComment(comment._id)}
                        disabled={!editingText.trim()}
                      >
                        <Check size={16} />
                      </Button>
                      <Button
                        type="button"
                        variant="outline-secondary"
                        size="sm"
                        onClick={cancelEditing}
                      >
                        <X size={16} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline-primary"
                        size="sm"
                        onClick={() => startEditing(comment)}
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button
                        type="button"
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </>
                  )}
                </div>
              )}
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
        <Button
          variant="primary"
          type="submit"
          disabled={!newComment.trim()}
          className="d-flex align-items-center gap-2"
        >
          <Send size={16} />
          Invia Commento
        </Button>
      </Form>
    </div>
  );
};

export default CommentArea;
