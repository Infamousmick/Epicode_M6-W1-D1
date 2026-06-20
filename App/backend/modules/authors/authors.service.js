const authorSchema = require("./authors.schema");
const blogPostSchema = require("../blogPosts/blogPosts.schema");

const getAuthors = async () => {
  const authors = await authorSchema.find();
  return authors;
};

const createAuthor = async (body) => {
  const newAuthor = new authorSchema(body);
  await newAuthor.save();
  const safeAuthor = newAuthor.toObject();
  delete safeAuthor.password;
  return safeAuthor;
};

const getSingleAuthor = async (id) => {
  const author = await authorSchema.findById(id);
  return author;
};

const editAuthor = async (id, body) => {
  const author = await authorSchema.findByIdAndUpdate(id, body, { new: true });
  return author;
};

const deleteAuthor = async (id) => {
  const author = await authorSchema.findByIdAndDelete(id);
  return author;
};

const getPostsByAuthor = async (id) => {
  const author = await authorSchema.findById(id);
  if (!author) return null;

  return await blogPostSchema.find({ author: author._id }).populate("author");
};
module.exports = {
  getAuthors,
  createAuthor,
  getSingleAuthor,
  editAuthor,
  deleteAuthor,
  getPostsByAuthor,
};
