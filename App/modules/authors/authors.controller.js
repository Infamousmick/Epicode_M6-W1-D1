const { response } = require("express");
const authorService = require("./authors.service");
const authors = require("./authors.route");

const getAuthors = async (request, response) => {
  try {
    const authors = await authorService.getAuthors();
    response.status(200).send({ statusCode: 200, authors });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      statusCode: 500,
      message: "Errore during user request",
    });
  }
};

const createAuthor = async (request, response) => {
  try {
    const { body } = request;
    const author = await authorService.createAuthor(body);

    response.status(201).send({ statusCode: 201, author });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      statusCode: 500,
      message: "Errore during user request",
    });
  }
};

const getSingleAuthor = async (request, response) => {
  try {
    const { id } = request.params;
    const author = await authorService.getSingleAuthor(id);
    if (!author) {
      return response
        .status(404)
        .send({ statusCode: 404, message: "Autore non trovato!" });
    }
    response.status(200).send({ statusCode: 200, author });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      statusCode: 500,
      message: "Errore during user request",
    });
  }
};

const editAuthor = async (request, response) => {
  try {
    const { id } = request.params;
    const { body } = request;
    const author = await authorService.editAuthor(id, body);
    if (!author) {
      return response
        .status(404)
        .send({ statusCode: 404, message: "Autore non trovato!" });
    }
    response.status(200).send({ statusCode: 200, author });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      statusCode: 500,
      message: "Errore during user request",
    });
  }
};
const deleteAuthor = async (request, response) => {
  try {
    const { id } = request.params;
    const author = await authorService.deleteAuthor(id);
    if (!author) {
      console.error(e);
      return response
        .status(404)
        .send({ statusCode: 404, message: "Autore non trovato!" });
    }
    response.status(200).send({ statusCode: 200, author });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      statusCode: 500,
      message: "Errore during user request",
    });
  }
};
const getPostsByAuthor = async (request, response) => {
  try {
    const { id } = request.params;
    const blogPosts = await authorService.getPostsByAuthor(id);

    if (!blogPosts) {
      return response
        .status(404)
        .send({ statusCode: 404, message: "Autore non trovato!" });
    }
    response.status(200).send({ statusCode: 200, blogPosts });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      statusCode: 500,
      message: "Errore during user request",
    });
  }
};

module.exports = {
  getAuthors,
  createAuthor,
  getSingleAuthor,
  editAuthor,
  deleteAuthor,
  getPostsByAuthor,
};
