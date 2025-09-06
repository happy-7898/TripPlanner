const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/responseHandler.util");
const env = require("../../config/env.config");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Authorization token missing", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

    req.user = decodedToken;
    next();
  } catch (err) {
    console.log(err);
    return sendError(res, "Invalid or expired token", 401);
  }
};

module.exports = authenticate;
