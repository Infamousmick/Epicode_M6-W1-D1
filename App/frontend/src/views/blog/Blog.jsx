import React, { useEffect, useState } from "react";
import { Container, Image, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import CommentArea from "../../components/comments/CommentsArea";
import "./styles.css";

const Blog = (props) => {
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const { id } = params;

    const fetchBlogPost = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/blogPosts/${id}`,
        );

        if (response.ok) {
          const data = await response.json();
          setBlog(data);
          setLoading(false);
        } else {
          navigate("/404");
        }
      } catch (error) {
        console.error("Errore nel caricamento del post", error);
        navigate("/404");
      }
    };

    fetchBlogPost();
  }, [params, navigate]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  } else {
    return (
      <div className="blog-details-root">
        <Container>
          <Image className="blog-details-cover" src={blog.cover} fluid />
          <h1 className="blog-details-title">{blog.title}</h1>

          <div className="blog-details-container">
            <div className="blog-details-author">
              {blog.author && <BlogAuthor {...blog.author} />}
            </div>
            <div className="blog-details-info">
              <div>{new Date(blog.createdAt).toLocaleDateString()}</div>

              {blog.readTime && (
                <div>{`lettura da ${blog.readTime.value} ${blog.readTime.unit}`}</div>
              )}
              <div style={{ marginTop: 20 }}>
                <BlogLike defaultLikes={["123"]} onChange={console.log} />
              </div>
            </div>
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          ></div>

          <hr className="my-5" />

          <div className="comments-section pb-5">
            <h3 className="mb-4">Commenti</h3>

            <CommentArea postId={blog._id} />
          </div>
        </Container>
      </div>
    );
  }
};

export default Blog;
