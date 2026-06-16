const jwt = require("jsonwebtoken");
const EXCLUDED_ROUTES = ["/auth/login", "/authors"];

const verifyToken = async (req, res, next) => {
  if (EXCLUDED_ROUTES.includes(req.path)) return next();

  const authHeader = req.header("authorization");

  if (!authHeader) {
    return res
      .status(401)
      .send({ statusCode: 401, message: "Authorization header missing!" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .send({ statusCode: 401, message: "Token format invalid!" });
  }

  try {
    req.author = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    return res
      .status(401)
      .send({ statusCode: 401, message: "Unvalid or expired token!" });
  }
};

module.exports = verifyToken;
