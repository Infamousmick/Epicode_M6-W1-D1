const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Author = require("../authors/authors.schema");

const login = async (email, password) => {
  const author = await Author.findOne({ email }).select("+password");

  if (!author) return null;
  if (!author.password || author.authProvider !== "local") return null;


  const isPasswordValid = await bcrypt.compare(password, author.password);

  if (!isPasswordValid) return null;

  const token = jwt.sign(
    {
      firstname: author.firstName,
      lastName: author.lastName,
      email: author.email,
      id: author._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
  const safeAuthor = author.toObject();
  delete safeAuthor.password;

  return { token, author: safeAuthor };
};

module.exports = { login };
