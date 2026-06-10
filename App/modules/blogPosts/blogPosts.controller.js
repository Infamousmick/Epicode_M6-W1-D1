const blogPostService = require("./blogPosts.service");
const { sendMail } = require("../../modules/mail/mail");

const getPosts = async (req, res) => {
  try {
    const { page = 1, pageSize = 5, title } = req.query;
    const {
      posts: blogPosts,
      totalPosts,
      totalPages,
    } = await blogPostService.getPosts(page, pageSize, title);
    res
      .status(200)
      .send({ statusCode: 200, blogPosts, totalPosts, totalPages });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Error during user request",
    });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    const blogPost = await blogPostService.getSinglePost(id);
    if (!blogPost) {
      return res
        .status(404)
        .send({ statusCode: 404, message: "Post non trovato!" });
    }
    res.status(200).send({ statusCode: 200, blogPost });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Error during user request",
    });
  }
};

const createPost = async (req, res) => {
  try {
    const { body } = req;
    const blogPost = await blogPostService.createPost(body);
    if (blogPost.author) {
      await sendMail(
        blogPost.author,
        "Post caricato su Strive Blog!",
        `Ciao ${blogPost.author}, il tuo post è stato caricato. Contenuto post: ${blogPost.content}`,
      );
    }
    res.status(201).send({ statusCode: 201, blogPost });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Error during user request",
    });
  }
};

const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const blogPost = await blogPostService.editPost(id, body);

    if (!blogPost) {
      return res
        .status(404)
        .send({ statusCode: 404, message: "Post non trovato!" });
    }
    res.status(200).send({ statusCode: 200, blogPost });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Error during user request",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const blogPost = await blogPostService.deletePost(id);

    if (!blogPost) {
      return res
        .status(404)
        .send({ statusCode: 404, message: "Post non trovato!" });
    }
    res
      .status(200)
      .send({ statusCode: 200, message: "Post cancellato con successo" });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Error during user request",
    });
  }
};

const uploadCover = async (req, res) => {
  try {
    const { blogPostId } = req.params;
    const imageUrl = req.file.path;
    const updatedPost = await blogPostService.editPost(blogPostId, {
      cover: imageUrl,
    });
    if (!updatedPost) {
      return res
        .status(404)
        .send({ statusCode: 404, message: "Post non trovato" });
    }
    res.status(200).send({ statusCode: 200, cover: updatedPost });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .send({ statusCode: 550, message: "Error during user request" });
  }
};

// Comments
const getCommentsById = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await blogPostService.getCommentsById(id);
    if (!comments) {
      return res.status(404).send({
        statusCode: 404,
        message: "Post non trovato!",
      });
    }
    res.status(200).send({ statusCode: 200, comments });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Error during user request",
    });
  }
};

const getSingleCommentById = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const comment = await blogPostService.getSingleCommentById(id, commentId);
    if (!comment) {
      return res.status(404).send({
        statusCode: 404,
        message: "Post non trovato o commento non appartenente a questo post",
      });
    }
    res.status(200).send({ statusCode: 200, comment });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Error during user request",
    });
  }
};

const createCommentById = async (req, res) => {
  try {
    const { body } = req;
    const { id } = req.params;
    const updatedPost = await blogPostService.createCommentById(id, body);
    if (updatedPost.author) {
      await sendMail(
        updatedPost.author,
        "Commento caricato su sotto al post!",
        `Ciao ${updatedPost.author}, il tuo commento è stato caricato. Contenuto commento: ${updatedPost.text}`,
      );
    }
    res.status(201).send({ statusCode: 201, updatedPost });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Error during user request",
    });
  }
};

const editCommentById = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { body } = req;
    const comment = await blogPostService.editCommentById(body, id, commentId);

    if (!comment) {
      return res.status(404).send({
        statusCode: 404,
        message: "Post non trovato o commento non appartenente a questo post",
      });
    }
    res.status(200).send({ statusCode: 200, comment });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Error during user request",
    });
  }
};

const deleteCommentById = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const comment = await blogPostService.deleteCommentById(id, commentId);

    if (!comment) {
      return res.status(404).send({
        statusCode: 404,
        message: "Post non trovato o commento non appartenente a questo post",
      });
    }

    res.status(200).send({ statusCode: 200, comment });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Error during user request",
    });
  }
};

module.exports = {
  getPosts,
  getSinglePost,
  createPost,
  editPost,
  deletePost,
  uploadCover,
  getCommentsById,
  getSingleCommentById,
  createCommentById,
  editCommentById,
  deleteCommentById,
};
