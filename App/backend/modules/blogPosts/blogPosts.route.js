const express = require("express");
const blogPosts = express.Router();
const blogPostsController = require("./blogPosts.controller");
const upload = require("../../middlewares/multer/index");
const blogPostsSchema = require("./blogPosts.schema");
const {
  postValidationRules,
  validate,
} = require("../../middlewares/validation/blogPosts.validation");

blogPosts.get("/", blogPostsController.getPosts);
blogPosts.get("/:id", blogPostsController.getSinglePost);

blogPosts.post(
  "/",
  postValidationRules,
  validate,
  blogPostsController.createPost,
);
blogPosts.put("/:id", blogPostsController.editPost);
blogPosts.delete("/:id", blogPostsController.deletePost);
blogPosts.patch(
  "/:blogPostId/cover",
  upload.single("cover"),
  blogPostsController.uploadCover,
);

//Commenti

blogPosts.get("/:id/comments", blogPostsController.getCommentsById);
blogPosts.get(
  "/:id/comments/:commentId",
  blogPostsController.getSingleCommentById,
);
blogPosts.post("/:id/comments", blogPostsController.createCommentById);
blogPosts.put("/:id/comment/:commentId", blogPostsController.editCommentById);
blogPosts.delete(
  "/:id/comment/:commentId",
  blogPostsController.deleteCommentById,
);
module.exports = blogPosts;
