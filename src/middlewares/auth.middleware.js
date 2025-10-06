const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/responseHandler.util");
const env = require("../../config/env.config");
const { User } = require("../models/sequelize/index");
const LoginSession = require("../models/mongoose/loginSession");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Authorization token missing", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await jwt.verify(token, env.ACCESS_TOKEN_SECRET);

    const user = await User.findByPk(decodedToken.id);

    if (!user) return sendError(res, "User not found", 401);

    const deviceId = req.headers["x-device-id"];
    const session = await LoginSession.findOne({ userId: user.id, deviceId, accessToken: token });

    if (!session) return sendError(res, "Invalid or expired session", 401);

    req.user = decodedToken;
    next();
  } catch (err) {
    console.log(err);
    return sendError(res, "Invalid or expired token", 401);
  }
};

const authenticateRefresh = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Refresh token missing", 401);
  }

  const refreshToken = authHeader.split(" ")[1];

  try {
    const decoded = await jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) return sendError(res, "User not found", 403);

    const deviceId = req.headers["x-device-id"];
    const session = await LoginSession.findOne({ userId: user.id, deviceId, refreshToken });

    if (!session) return sendError(res, "Refresh token invalid or revoked", 403);

    req.user = decoded;
    req.refreshToken = refreshToken;
    next();
  } catch (err) {
    console.error("Refresh token verification error:", err);
    return sendError(res, "Invalid or expired refresh token", 403);
  }
};

module.exports = {
  authenticate,
  authenticateRefresh,
};
