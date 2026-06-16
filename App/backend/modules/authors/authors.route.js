const express = require("express");
const authors = express.Router();
const authorController = require("./authors.controller");
const upload = require("../../middlewares/multer/index");
const {
  authorValidationRules,
  validate,
} = require("../../middlewares/validation/authors.validation");

authors.get("/", authorController.getAuthors);
authors.get("/:id", authorController.getSingleAuthor);
authors.post(
  "/",
  authorValidationRules,
  validate,
  authorController.createAuthor,
);
authors.patch(
  "/:authorId/avatar",
  upload.single("avatar"),
  authorController.uploadAvatar,
);

// EXTRA
authors.get("/:id/blogPosts/", authorController.getPostsByAuthor);
authors.put("/:id", authorController.editAuthor);
authors.delete("/:id", authorController.deleteAuthor);

module.exports = authors;
