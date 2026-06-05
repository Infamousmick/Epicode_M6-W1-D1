const { res } = require("express");
const authorService = require("./authors.service");
const authors = require("./authors.route");

const getAuthors = async (req, res) => {
  try {
    const authors = await authorService.getAuthors();
    res.status(200).send({ statusCode: 200, authors });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Errore during user req",
    });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { body } = req;
    const author = await authorService.createAuthor(body);

    res.status(201).send({ statusCode: 201, author });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Errore during user req",
    });
  }
};

const getSingleAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await authorService.getSingleAuthor(id);
    if (!author) {
      return res
        .status(404)
        .send({ statusCode: 404, message: "Autore non trovato!" });
    }
    res.status(200).send({ statusCode: 200, author });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Errore during user req",
    });
  }
};

const editAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const author = await authorService.editAuthor(id, body);
    if (!author) {
      return res
        .status(404)
        .send({ statusCode: 404, message: "Autore non trovato!" });
    }
    res.status(200).send({ statusCode: 200, author });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Errore during user req",
    });
  }
};
const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await authorService.deleteAuthor(id);
    if (!author) {
      console.error(e);
      return res
        .status(404)
        .send({ statusCode: 404, message: "Autore non trovato!" });
    }
    res.status(200).send({ statusCode: 200, author });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Errore during user req",
    });
  }
};
const getPostsByAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const blogPosts = await authorService.getPostsByAuthor(id);

    if (!blogPosts) {
      return res
        .status(404)
        .send({ statusCode: 404, message: "Autore non trovato!" });
    }
    res.status(200).send({ statusCode: 200, blogPosts });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Errore during user req",
    });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const { authorId } = req.params;
    const imageUrl = req.file.path;
    const updateAuthor = await authorService.editAuthor(authorId, {
      avatar: imageUrl,
    });

    if (!updateAuthor) {
      return res.status(404).send({ statusCode: 404, message: "Autore non trovato" });
    }
    res.status(200).send({ statusCode: 200, author: updateAuthor });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Errore during user req",
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
  uploadAvatar,
};
