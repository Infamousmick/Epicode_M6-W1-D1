const jwt = require("jsonwebtoken");
const EXCLUDED_ROUTES = [
  { method: "POST", path: "/auth/login" },
  { method: "GET", path: "/auth/google" },
  { method: "GET", path: "/auth/google/callback" },
  { method: "POST", path: "/authors" },
];

const verifyToken = async (req, res, next) => {
  const isExcludedRoute = EXCLUDED_ROUTES.some(
    (route) => route.method === req.method && route.path === req.path,
  );

  if (isExcludedRoute) return next();

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
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

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
