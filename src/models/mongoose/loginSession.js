const mongoose = require("mongoose");

const loginSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const LoginSession = mongoose.model("LoginSession", loginSessionSchema);

module.exports = LoginSession;
