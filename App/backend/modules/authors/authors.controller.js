const authorService = require("./authors.service");
const { sendMail } = require("../../modules/mail/mail");
const UserNotFoundException = require("../../exception/authors/UserNotFoundException");

const getAuthors = async (req, res, next) => {
  try {
    const authors = await authorService.getAuthors();
    if (authors.length === 0) {
      throw new UserNotFoundException();
    }

    res.status(200).send({ statusCode: 200, authors });
  } catch (e) {
    next(e);
  }
};

const createAuthor = async (req, res, next) => {
  try {
    const { body } = req;
    const author = await authorService.createAuthor(body);

    if (author.email) {
      await sendMail(
        author.email,
        "Benvenuto a Bordo!",
        `Ciao ${author.firstName}, la tua registrazione è confermata!`,
      );
    }
    res.status(201).send({ statusCode: 201, author });
  } catch (e) {
    next(e);
  }
};

const getSingleAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await authorService.getSingleAuthor(id);
    if (!author) {
      throw new UserNotFoundException("Autore non trovato con questo ID");
    }
    res.status(200).send({ statusCode: 200, author });
  } catch (e) {
    next(e);
  }
};

const editAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const author = await authorService.editAuthor(id, body);
    if (!author) {
      throw new UserNotFoundException("Autore non trovato con questo ID");
    }
    res.status(200).send({ statusCode: 200, author });
  } catch (e) {
    next(e);
  }
};
const deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await authorService.deleteAuthor(id);
    if (!author) {
      throw new UserNotFoundException("Autore non trovato con questo ID");
    }
    res.status(200).send({ statusCode: 200, author });
  } catch (e) {
    next(e);
  }
};
const getPostsByAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blogPosts = await authorService.getPostsByAuthor(id);

    if (!blogPosts) {
      throw new UserNotFoundException("Autore non trovato con questo ID");
    }
    res.status(200).send({ statusCode: 200, blogPosts });
  } catch (e) {
    next(e);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    const { authorId } = req.params;
    const imageUrl = req.file.path;
    const updateAuthor = await authorService.editAuthor(authorId, {
      avatar: imageUrl,
    });

    if (!updateAuthor) {
      throw new UserNotFoundException("Autore non trovato con questo ID");
    }
    res.status(200).send({ statusCode: 200, author: updateAuthor });
  } catch (e) {
    next(e);
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
