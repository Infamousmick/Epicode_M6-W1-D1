require("dotenv").config();
const express = require("express");
const initServer = require("./config/db");
const PORT = process.env.PORT;
const server = express();
const authorsRoute = require("./modules/authors/authors.route");
const blogPostsRoute = require("./modules/blogPosts/blogPosts.route");
const cors = require("cors");
const verifyToken = require("./middlewares/auth/auth.middleware");
const authRoute = require("./modules/auth/auth.route");
const errorHandler = require("./middlewares/errors/errorHandler");
const { requestLogger } = require("./middlewares/logger/logger");
const googleOauthRoute = require("./modules/oauth/google/oauth.route")

server.use(cors({origin: process.env.FRONTEND_URL}));
server.use(express.json());
server.use(requestLogger);
server.use(verifyToken);
server.use("/authors", authorsRoute);
server.use("/blogPosts", blogPostsRoute);
server.use("/auth", authRoute);
server.use("/auth", googleOauthRoute);
server.use(errorHandler);
initServer(PORT, server);
