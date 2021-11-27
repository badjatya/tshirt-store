const mongoose = require("mongoose");

// Library
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user must have a name"],
    maxlength: [40, "A name must be less than 40 character"],
  },
  email: {
    type: String,
    required: [true, "user must have an email"],
    validate: [validator.isEmail, "Enter a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "user must have a password"],
    minlength: [6, "A password must be of at least 6 characters"],
  },
  photo: {
    id: {
      type: String,
      required: true,
    },
    secureUrl: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hashing Password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// verifying password
userSchema.methods.isValidatedPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Creating jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// creating forgot password token
userSchema.methods.getForgotPasswordToken = function () {
  const forgotToken = crypto.randomBytes(20).toString("hex");

  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");
  this.forgotPasswordTokenExpiry = Date.now() * 20 * 60 * 1000;

  return forgotToken;
};

module.exports = mongoose.model("User", userSchema);
