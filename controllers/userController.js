// Model
const User = require("../models/user");

// Utils
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");

exports.signup = BigPromise(async (req, res, next) => {
  res.send("Hello");
});
