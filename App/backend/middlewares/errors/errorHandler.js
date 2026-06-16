const HttpException = require("../../exception/index");
const mongoose = require("mongoose");
const pc = require("picocolors");

const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      error: err.error || null,
    });
  }

  console.error(
    pc.red("🔴 ERRORE CRITICO DAL SERVER:") + pc.yellow(err.message),
  );
  return res.status(500).json({
    statusCode: 500,
    message: "Errore interno del server",
  });
};

module.exports = errorHandler;
