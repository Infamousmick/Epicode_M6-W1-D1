require("dotenv").config();
const express = require("express");
const initServer = require("./config/db");
const PORT = 9099;
const server = express();
const authorsRotue = require("./modules/authors/authors.route");
const cors = require("cors");

server.use(cors());
server.use(express.json());
server.use("/", authorsRotue);

initServer(PORT, server);
