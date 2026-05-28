const mongoose = require("mongoose");

const Author = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      max: 20,
    },
    lastName: {
      type: String,
      required: true,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, strict: true },
);

module.exports = mongoose.model("author", Author, "Authors");
