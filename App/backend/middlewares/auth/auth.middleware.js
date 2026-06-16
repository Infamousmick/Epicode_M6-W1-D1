const jwt = require("jsonwebtoken");
const EXCLUDED_ROUTES = [
  "/auth/login",
  "/auth/google",
  "/auth/google/callback",
  "/authors",
];

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
    decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    req.author = {
      ...decodedPayload,
      _id: decodedPayload.id || decodedPayload._id,
    };
    next();
  } catch (e) {
    return res
      .status(401)
      .send({ statusCode: 401, message: "Invalid or expired token!" });
  }
};

module.exports = verifyToken;
