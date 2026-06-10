const blogPostSchema = require("./blogPosts.schema");
const commentSchema = require("../comments/comments.schema");

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

// Comments

const isCommentLinkedToPost = async (postId, commentId) => {
  const post = await blogPostSchema.findById(postId);
  if (!post) return false;

  return post.comments.some((id) => id.toString() === commentId);
};

const getCommentsById = async (id) => {
  return await blogPostSchema.findById(id).populate("comments");
};

const getSingleCommentById = async (id, commentId) => {
  const isValid = await isCommentLinkedToPost(id, commentId);
  if (!isValid) return null;
  return await commentSchema.findById(commentId);
};

const createCommentById = async (id, body) => {
  const newComment = await commentSchema.create(body);
  const updatePost = await blogPostSchema
    .findByIdAndUpdate(
      id,
      { $push: { comments: newComment._id } },
      { new: true },
    )
    .populate("comments");
  return updatePost;
};

const editCommentById = async (body, id, commentId) => {
  const isValid = await isCommentLinkedToPost(id, commentId);
  if (!isValid) return null;

  return await commentSchema.findByIdAndUpdate(commentId, body, {
    new: true,
  });
};

const deleteCommentById = async (id, commentId) => {
  const isValid = await isCommentLinkedToPost(id, commentId);
  if (!isValid) return null;

  const deletedComment = await commentSchema.findByIdAndDelete(commentId);

  await blogPostSchema.findByIdAndUpdate(
    id,
    { $pull: { comments: deletedComment._id } },
    { new: true },
  );
  return deletedComment;
};
module.exports = {
  getPosts,
  getSinglePost,
  createPost,
  editPost,
  deletePost,
  getCommentsById,
  getSingleCommentById,
  createCommentById,
  editCommentById,
  deleteCommentById,
};
