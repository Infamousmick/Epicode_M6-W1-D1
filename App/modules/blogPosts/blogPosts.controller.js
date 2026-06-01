const blogPostService = require("./blogPosts.service");

const getPosts = async (request, response) => {
  try {
    const { page = 1, pageSize = 5, title } = request.query;
    const {
      posts: blogPosts,
      totalPosts,
      totalPages,
    } = await blogPostService.getPosts(page, pageSize, title);
    response
      .status(200)
      .send({ statusCode: 200, blogPosts, totalPosts, totalPages });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      statusCode: 500,
      message: "Error during user request",
    });
  }
};

const getSinglePost = async (request, response) => {
  try {
    const { id } = request.params;
    const blogPost = await blogPostService.getSinglePost(id);
    if (!blogPost) {
      return response
        .status(404)
        .send({ statusCode: 404, message: "Post non trovato!" });
    }
    response.status(200).send({ statusCode: 200, blogPost });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      statusCode: 500,
      message: "Errore during user request",
    });
  }
};

const createPost = async (request, response) => {
  try {
    const { body } = request;
    const blogPost = await blogPostService.createPost(body);
    response.status(201).send({ statusCode: 201, blogPost });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      statusCode: 500,
      message: "Errore during user request",
    });
  }
};

const editPost = async (request, response) => {
  try {
    const { id } = request.params;
    const { body } = request;
    const blogPost = await blogPostService.editPost(id, body);

    if (!blogPost) {
      return response
        .status(404)
        .send({ statusCode: 404, message: "Post non trovato!" });
    }
    response.status(200).send({ statusCode: 200, blogPost });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      statusCode: 500,
      message: "Errore during user request",
    });
  }
};

const deletePost = async (request, response) => {
  try {
    const { id } = request.params;
    const blogPost = await blogPostService.deletePost(id);

    if (!blogPost) {
      return response
        .status(404)
        .send({ statusCode: 404, message: "Post non trovato!" });
    }
    response
      .status(200)
      .send({ statusCode: 200, message: "Post cancellato con successo" });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      statusCode: 500,
      message: "Errore during user request",
    });
  }
};

module.exports = {
  getPosts,
  getSinglePost,
  createPost,
  editPost,
  deletePost,
};
