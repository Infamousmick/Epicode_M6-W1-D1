const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Author = require("../authors/authors.schema");

const login = async (email, password) => {
  const author = await Author.findOne({ email });

  if (!author) return null;

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
  return { token, author };
};

module.exports = { login };
