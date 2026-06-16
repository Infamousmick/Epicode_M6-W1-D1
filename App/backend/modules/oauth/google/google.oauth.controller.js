const jwt = require("jsonwebtoken");
const Author = require("../../authors/authors.schema");

const manageOauthCallback = async (req, res, next) => {
  try {
    const user = req.user;
    let author = await Author.findOne({ email: user.emails[0].value });

    if (!author) {
      const newAuthor = new Author({
        firstName: user.name.givenName || "Utente",
        lastName: user.name.familyName || "Google",
        email: user.emails[0].value,
        password: "OAuthPassword123!",
        dateOfBirth: "1990-01-01",
        avatar: user.photos[0].value,
      });
      author = await newAuthor.save();
    }

    const payload = {
      id: author._id,
      firstName: author.firstName,
      lastName: author.lastName,
      email: author.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const redirectUrl = `http://localhost:3000/auth/success?token=${token}`;
    res.redirect(redirectUrl);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  manageOauthCallback,
};
