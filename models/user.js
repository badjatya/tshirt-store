const mongoose = require("mongoose");

// Library
const bcrypt = require("bcryptjs");
const validator = require("validator");

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
  forgotPasswordTokenExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hashing Password
userSchema.pre("save", function (next) {
  if (this.isModified(this.password)) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
