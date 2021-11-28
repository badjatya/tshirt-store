// Model
const User = require("../models/user");

// Utils
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");

// Lib
const cloudinary = require("cloudinary");

exports.allUsers = BigPromise(async (req, res, next) => {});
