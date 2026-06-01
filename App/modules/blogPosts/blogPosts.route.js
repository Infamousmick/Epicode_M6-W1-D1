const express = require("express");
const blogPosts = express.Router();
const blogPostsController = require("./blogPosts.controller");

blogPosts.get("/", blogPostsController.getPosts);
blogPosts.get("/:id", blogPostsController.getSinglePost);

blogPosts.post("/", blogPostsController.createPost);
blogPosts.put("/:id", blogPostsController.editPost);
blogPosts.delete("/:id", blogPostsController.deletePost);

module.exports = blogPosts;
