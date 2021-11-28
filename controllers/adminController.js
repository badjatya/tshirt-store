// Model
const User = require("../models/user");

// Utils
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");

exports.adminAllUsers = BigPromise(async (req, res, next) => {
  const users = await User.find({}).select("-password");

  res.status(200).json({
    status: "success",
    results: users.length,
    users,
  });
});
