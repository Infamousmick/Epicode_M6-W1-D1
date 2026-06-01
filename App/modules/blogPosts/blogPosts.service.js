const blogPostSchema = require("./blogPosts.schema");

const getPosts = async (page, pageSize, title) => {
  const query = title ? { title: { $regex: title, $options: "i" } } : {};
  const posts = await blogPostSchema
    .find(query)
    .limit(pageSize)
    .skip((page - 1) * pageSize);

  const totalPosts = await blogPostSchema.countDocuments(query);
  const totalPages = Math.ceil(totalPosts / pageSize);

  return {
    posts,
    totalPosts,
    totalPages,
  };
};

const getSinglePost = async (id) => {
  return await blogPostSchema.findById(id);
};

const createPost = async (body) => {
  return await new blogPostSchema(body).save();
};

const editPost = async (id, body) => {
  return await blogPostSchema.findByIdAndUpdate(id, body, { new: true });
};

const deletePost = async (id) => {
  return await blogPostSchema.findByIdAndDelete(id);
};
module.exports = {
  getPosts,
  getSinglePost,
  createPost,
  editPost,
  deletePost,
};
