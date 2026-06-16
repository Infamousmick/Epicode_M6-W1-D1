const mongoose = require("mongoose");

const Comments = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, strict: true },
);

module.exports = mongoose.model("Comment", Comments, "Comments");
