const { User, Otp } = require("../models/sequelize/index");
const generateOTP = require("../utils/generateOtp.util");
const { sendOTP } = require("../services/sendOtp.service");
const { sendError, sendSuccess } = require("../utils/responseHandler.util");
const { hashData, compareData } = require("../utils/bcrypt.util");
const { generateAccessToken, generateRefreshToken } = require("../utils/token.util");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, "Name, password and email are required", 500);
    }

    let user = await User.findOne({ where: { email } });

    if (user && user.isRegistered) {
      return sendError(res, "User is already registered. Please login.", 400);
    }

    const hashedPassword = await hashData(password);

    if (!user) {
      user = await User.create({ name, email, password: hashedPassword });
    } else {
      user.password = hashedPassword;
      await user.save();
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // expires in 5 min
    const hashedOtp = await hashData(otpCode);

    await Otp.upsert({
      userId: user.id,
      otp: hashedOtp,
      expiresAt,
    });

    await sendOTP(email, otpCode);

    return sendSuccess(res, { userId: user.id }, "OTP sent successfully");
  } catch (error) {
    console.error("Signup error:", error);
    sendError(res, "Internal server error", 500);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return sendError(res, "User ID and OTP are required", 400);
    }

    const otpRecord = await Otp.findOne({ where: { userId } });

    if (!otpRecord) {
      return sendError(res, "Invalid user", 400);
    }

    if (otpRecord.expiresAt < new Date()) {
      return sendError(res, "OTP has expired. Please request again.", 400);
    }

    const isValidOtp = await compareData(otp, otpRecord.otp);

    if (!isValidOtp) {
      return sendError(res, "Invalid OTP", 400);
    }

    const user = await User.findByPk(userId);

    user.isRegistered = true;
    await user.save();

    await Otp.destroy({ where: { userId } });

    const payload = { id: user.id, email: user.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return sendSuccess(res, { accessToken, refreshToken }, "OTP verified successfully. User registered.");
  } catch (error) {
    console.error("Verify OTP error:", error);
    sendError(res, "Internal server error", 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Email and password are required", 400);
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !user.isRegistered) {
      return sendError(res, "User not found", 404);
    }

    const isPasswordValid = await compareData(password, user.password);

    if (!isPasswordValid) {
      return sendError(res, "Invalid credentials", 401);
    }

    const payload = { id: user.id, email: user.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return sendSuccess(res, { accessToken, refreshToken }, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    sendError(res, "Internal server error", 500);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password", "isRegistered", "createdAt", "updatedAt"] },
    });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, user, "User profile fetched successfully");
  } catch (error) {
    console.error("GetMe error:", error);
    sendError(res, "Internal server error", 500);
  }
};

module.exports = {
  signup,
  verifyOtp,
  login,
  getMe,
};
