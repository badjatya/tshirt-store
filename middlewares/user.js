const User = require("../models/user");
const jwt = require("jsonwebtoken");
const BigPromise = require("./bigPromise");
const CustomError = require("../utils/customError");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  const token =
    req.cookies.token ||
    req.body.token ||
    req.header("Authorization").replace("Bearer " + "");

  if (!token) {
    return next(new CustomError("Login to access the page", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decoded.id);

  req.user = user;
  next();
});

exports.customRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new CustomError("You are not allowed for this resouce", 403));
    }
    next();
  };
};
