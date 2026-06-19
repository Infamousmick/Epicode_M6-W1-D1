const blogPostService = require("./blogPosts.service");
const { sendMail } = require("../../modules/mail/mail");
const PostNotFoundException = require("../../exception/posts/PostsNotFoundException");

const getPosts = async (req, res, next) => {
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
    next(e);
  }
};

const getSinglePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blogPost = await blogPostService.getSinglePost(id);
    if (!blogPost) {
      throw new PostNotFoundException(
        "Impossibile trovare un post con questo ID",
      );
    }
    res.status(200).send({ statusCode: 200, blogPost });
  } catch (e) {
    next(e);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { body } = req;
    const blogPost = await blogPostService.createPost(body);
    if (blogPost.author) {
      await sendMail(
        req.author.email,
        "Post caricato su Strive Blog!",
        `Ciao ${req.author.firstName}, il tuo post è stato caricato. Contenuto post: ${blogPost.content}`,
      );
    }
    res.status(201).send({ statusCode: 201, blogPost });
  } catch (e) {
    next(e);
  }
};

const editPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const blogPost = await blogPostService.editPost(id, body);

    if (!blogPost) {
      throw new PostNotFoundException(
        "Impossibile trovare un post con questo ID",
      );
    }
    res.status(200).send({ statusCode: 200, blogPost });
  } catch (e) {
    next(e);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blogPost = await blogPostService.deletePost(id);

    if (!blogPost) {
      throw new PostNotFoundException(
        "Impossibile trovare un post con questo ID",
      );
    }
    res
      .status(200)
      .send({ statusCode: 200, message: "Post cancellato con successo" });
  } catch (e) {
    next(e);
  }
};

const uploadCover = async (req, res, next) => {
  try {
    const { blogPostId } = req.params;
    const imageUrl = req.file.path;
    const updatedPost = await blogPostService.editPost(blogPostId, {
      cover: imageUrl,
    });
    if (!updatedPost) {
      throw new PostNotFoundException(
        "Impossibile trovare un post con questo ID",
      );
    }
    res.status(200).send({ statusCode: 200, cover: updatedPost });
  } catch (e) {
    next(e);
  }
};

// Comments
const getCommentsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await blogPostService.getCommentsById(id);
    if (!post) {
      throw new PostNotFoundException(
        "Impossibile trovare un post con questo ID",
      );
    }
    res.status(200).send({ statusCode: 200, comments: post.comments });
  } catch (e) {
    next(e);
  }
};

const getSingleCommentById = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    const comment = await blogPostService.getSingleCommentById(id, commentId);
    if (!comment) {
      throw new PostNotFoundException(
        "Impossibile trovare un post con questo ID",
      );
    }

    res.status(200).send({ statusCode: 200, comment });
  } catch (e) {
    next(e);
  }
};

const createCommentById = async (req, res, next) => {
  try {
    const { body } = req;
    const { id } = req.params;
    const updatedPost = await blogPostService.createCommentById(id, body);
    if (!updatedPost) {
      throw new PostNotFoundException(
        "Impossibile trovare un post con questo ID",
      );
    }
    if (updatedPost.author) {
      try {
        await sendMail(
          req.author.email,
          "Commento caricato sotto al post!",
          `Ciao ${req.author.firstName}, il tuo commento è stato caricato. Contenuto commento: ${body.text}`,
        );
      } catch (mailError) {
        console.error("Errore invio mail commento:", mailError.message);
      }
    }
    res.status(201).send({ statusCode: 201, updatedPost });
  } catch (e) {
    next(e);
  }
};

const editCommentById = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    const { body } = req;
    const comment = await blogPostService.editCommentById(body, id, commentId);
    if (!comment) {
      throw new PostNotFoundException(
        "Impossibile trovare un post con questo ID",
      );
    }
    res.status(200).send({ statusCode: 200, comment });
  } catch (e) {
    next(e);
  }
};

const deleteCommentById = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    const comment = await blogPostService.deleteCommentById(id, commentId);
    if (!comment) {
      throw new PostNotFoundException(
        "Impossibile trovare un post con questo ID",
      );
    }

    res.status(200).send({ statusCode: 200, comment });
  } catch (e) {
    next(e);
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
