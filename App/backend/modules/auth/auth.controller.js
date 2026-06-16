const authService = require("./auth.service");
const Author = require("../authors/authors.schema");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginResult = await authService.login(email, password);

    if (!loginResult) {
      return res
        .status(401)
        .send({ statusCode: 401, message: "Email o password errati!" });
    }

    const { token, author } = loginResult;
    res.header("authorization", token).status(200).send({
      statusCode: 200,
      message: "Login successfully",
      token,
      author,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .send({ statusCode: 500, message: "Errore interno del server" });
  }
};

const getMe = async (req, res, next) => {
  try {
    const currentAuthor = await Author.findById(req.author.id).select(
      "-password",
    );

    if (!currentAuthor) {
      return res.status(404).send({ message: "Utente non trovato" });
    }

    res.status(200).send(currentAuthor);
  } catch (e) {
    next(e);
  }
};
module.exports = { login, getMe };
