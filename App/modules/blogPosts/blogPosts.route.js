const express = require("express");
const blogPosts = express.Router();
const blogPostsController = require("./blogPosts.controller");
const  upload  = require("../../middlewares/multer/index");

blogPosts.get("/", blogPostsController.getPosts);
blogPosts.get("/:id", blogPostsController.getSinglePost);

blogPosts.post("/", blogPostsController.createPost);
blogPosts.put("/:id", blogPostsController.editPost);
blogPosts.delete("/:id", blogPostsController.deletePost);
blogPosts.patch(
  "/:blogPostId/cover",
  upload.single("cover"),
  blogPostsController.uploadCover,
);

module.exports = blogPosts;
