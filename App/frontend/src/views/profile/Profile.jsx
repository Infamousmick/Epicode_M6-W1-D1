import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  Camera,
  Check,
  Edit3,
  Eye,
  FileText,
  Save,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import "./styles.css";

const emptyEditForm = {
  title: "",
  category: "Tech",
  content: "",
  cover: "",
  readTimeValue: 2,
  readTimeUnit: "minuti",
};

const Profile = () => {
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [editPost, setEditPost] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = useMemo(() => localStorage.getItem("token"), []);

  const authorId = author?._id || author?.id;
  const authorName =
    `${author?.firstName || ""} ${author?.lastName || ""}`.trim() ||
    author?.email ||
    "Utente";

  const fetchProfile = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const profileResponse = await fetch(
        `${process.env.REACT_APP_SERVERURL}/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!profileResponse.ok) {
        throw new Error("Impossibile caricare il profilo");
      }

      const profileData = await profileResponse.json();
      setAuthor(profileData);
      localStorage.setItem("author", JSON.stringify(profileData));

      const currentAuthorId = profileData._id || profileData.id;
      const postsResponse = await fetch(
        `${process.env.REACT_APP_SERVERURL}/authors/${currentAuthorId}/blogPosts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!postsResponse.ok) {
        throw new Error("Impossibile caricare i tuoi post");
      }

      const postsData = await postsResponse.json();
      setPosts(postsData.blogPosts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate, token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [avatarFile]);

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    if (!avatarFile || !authorId) return;

    try {
      setSavingAvatar(true);
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/authors/${authorId}/avatar`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload avatar non riuscito");
      }

      setAuthor(data.author);
      localStorage.setItem("author", JSON.stringify(data.author));
      setAvatarFile(null);
      setMessage("Avatar aggiornato correttamente");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingAvatar(false);
    }
  };

  const openEditModal = (post) => {
    setEditPost(post);
    setEditForm({
      title: post.title || "",
      category: post.category || "Tech",
      content: post.content || "",
      cover: post.cover || "",
      readTimeValue: post.readTime?.value || 2,
      readTimeUnit: post.readTime?.unit || "minuti",
    });
    setCoverFile(null);
  };

  const closeEditModal = () => {
    setEditPost(null);
    setEditForm(emptyEditForm);
    setCoverFile(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  };

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!editPost) return;

    try {
      setSavingPost(true);
      setError("");
      setMessage("");

      const payload = {
        title: editForm.title,
        category: editForm.category,
        content: editForm.content,
        cover: editForm.cover || editPost.cover,
        readTime: {
          value: Number(editForm.readTimeValue) || 1,
          unit: editForm.readTimeUnit || "minuti",
        },
      };

      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/blogPosts/${editPost._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Modifica post non riuscita");
      }

      let updatedPost = data.blogPost;

      if (coverFile) {
        const formData = new FormData();
        formData.append("cover", coverFile);

        const coverResponse = await fetch(
          `${process.env.REACT_APP_SERVERURL}/blogPosts/${editPost._id}/cover`,
          {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          },
        );

        const coverData = await coverResponse.json();

        if (!coverResponse.ok) {
          throw new Error(coverData.message || "Upload copertina non riuscito");
        }

        updatedPost = coverData.cover;
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post._id === editPost._id ? { ...post, ...updatedPost } : post,
        ),
      );
      setMessage("Post aggiornato correttamente");
      closeEditModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPost(false);
    }
  };

  const handlePostDelete = async (postId) => {
    const confirmed = window.confirm("Vuoi eliminare questo post?");
    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/blogPosts/${postId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Eliminazione post non riuscita");
      }

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId),
      );
      setMessage("Post eliminato correttamente");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container className="profile-page text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="profile-page">
      <div className="d-flex align-items-center gap-2 mb-4">
        <Settings size={26} />
        <h1 className="m-0">Impostazioni Account</h1>
      </div>

      {message && (
        <Alert variant="success" className="d-flex align-items-center gap-2">
          <Check size={18} />
          {message}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" className="d-flex align-items-center gap-2">
          <X size={18} />
          {error}
        </Alert>
      )}

      <Row className="g-4 align-items-start">
        <Col lg={4}>
          <section className="profile-panel">
            <div className="text-center">
              <Image
                src={
                  avatarPreview ||
                  author?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`
                }
                alt={authorName}
                className="profile-avatar"
              />
              <h2 className="h4 mt-3 mb-1">{authorName}</h2>
              <p className="text-muted mb-4">{author?.email}</p>
            </div>

            <Form onSubmit={handleAvatarSubmit}>
              <Form.Group controlId="avatar" className="mb-3">
                <Form.Label className="fw-bold">Avatar</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                />
              </Form.Group>
              <Button
                type="submit"
                variant="dark"
                className="w-100 d-flex align-items-center justify-content-center gap-2"
                disabled={!avatarFile || savingAvatar}
              >
                {savingAvatar ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <Camera size={18} />
                )}
                Aggiorna avatar
              </Button>
            </Form>
          </section>
        </Col>

        <Col lg={8}>
          <section>
            <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <FileText size={24} />
                <h2 className="h3 m-0">I miei post</h2>
              </div>
              <Badge bg="dark">{posts.length}</Badge>
            </div>

            {posts.length === 0 ? (
              <Alert variant="light" className="border">
                Non hai ancora pubblicato post.
              </Alert>
            ) : (
              <div className="profile-post-list">
                {posts.map((post) => (
                  <article className="profile-post" key={post._id}>
                    <Image
                      src={post.cover}
                      alt={post.title}
                      className="profile-post-cover"
                    />
                    <div className="profile-post-body">
                      <div>
                        <Badge bg="secondary" className="mb-2">
                          {post.category}
                        </Badge>
                        <h3 className="h5 mb-2">{post.title}</h3>
                        <p className="text-muted mb-0">
                          {post.readTime?.value} {post.readTime?.unit}
                        </p>
                      </div>
                      <div className="profile-post-actions">
                        <Button
                          as={Link}
                          to={`/blog/${post._id}`}
                          variant="outline-dark"
                          size="sm"
                          className="d-flex align-items-center gap-2"
                        >
                          <Eye size={16} />
                          Apri
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="d-flex align-items-center gap-2"
                          onClick={() => openEditModal(post)}
                        >
                          <Edit3 size={16} />
                          Modifica
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="d-flex align-items-center gap-2"
                          onClick={() => handlePostDelete(post._id)}
                        >
                          <Trash2 size={16} />
                          Elimina
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </Col>
      </Row>

      <Modal show={Boolean(editPost)} onHide={closeEditModal} size="lg" centered>
        <Form onSubmit={handlePostUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>Modifica post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group controlId="edit-title">
                  <Form.Label>Titolo</Form.Label>
                  <Form.Control
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    required
                    maxLength={20}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="edit-category">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    required
                  >
                    <option>Tech</option>
                    <option>News</option>
                    <option>Lifestyle</option>
                    <option>Coding</option>
                    <option>Modding</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="edit-readTimeValue">
                  <Form.Label>Tempo di lettura</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    name="readTimeValue"
                    value={editForm.readTimeValue}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="edit-readTimeUnit">
                  <Form.Label>Unita</Form.Label>
                  <Form.Control
                    name="readTimeUnit"
                    value={editForm.readTimeUnit}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="edit-cover">
                  <Form.Label>URL copertina</Form.Label>
                  <Form.Control
                    name="cover"
                    value={editForm.cover}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="edit-cover-file">
                  <Form.Label>Sostituisci copertina</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="edit-content">
                  <Form.Label>Contenuto</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    name="content"
                    value={editForm.content}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              variant="outline-dark"
              onClick={closeEditModal}
            >
              Annulla
            </Button>
            <Button
              type="submit"
              variant="dark"
              className="d-flex align-items-center gap-2"
              disabled={savingPost}
            >
              {savingPost ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Save size={18} />
              )}
              Salva
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Profile;
