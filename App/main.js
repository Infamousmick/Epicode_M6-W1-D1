require("dotenv").config();
const express = require("express");
const initServer = require("./config/db");
const PORT = 9099;
const server = express();
const authorsRoute = require("./modules/authors/authors.route");
const blogPostsRoute = require("./modules/blogPosts/blogPosts.route");
const cors = require("cors");

server.use(cors());
server.use(express.json());
server.use("/authors", authorsRoute);
server.use("/blogPosts", blogPostsRoute);

initServer(PORT, server);
