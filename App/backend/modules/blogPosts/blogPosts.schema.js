const mongoose = require("mongoose");

const BlogPost = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      max: 15,
    },
    title: {
      type: String,
      required: true,
      max: 20,
    },
    cover: {
      type: String,
      required: true,
    },
    readTime: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: [],
      },
    ],
  },
  { timestamps: true, strict: true },
);

module.exports = mongoose.model("blogPost", BlogPost, "BlogPosts");
