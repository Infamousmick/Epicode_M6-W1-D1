const authorsSchema = require("../authors/authors.schema");
const blogPostService = require("./blogPosts.service");

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
      message: "Error during user req",
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
      message: "Error during user req",
    });
  }
};

const createPost = async (req, res) => {
  try {
    const { body } = req;
    const blogPost = await blogPostService.createPost(body);
    res.status(201).send({ statusCode: 201, blogPost });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Error during user req",
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
      message: "Error during user req",
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
      message: "Error during user req",
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
      return res.status(404).send({ statusCode: 404, message: "Post non trovato" });
    }
    res.status(200).send({ statusCode: 200, cover: updatedPost });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .send({ statusCode: 550, message: "Error during user req" });
  }
};
module.exports = {
  getPosts,
  getSinglePost,
  createPost,
  editPost,
  deletePost,
  uploadCover,
};
