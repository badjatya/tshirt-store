// Model
const User = require("../models/user");

// Utils
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");

// Lib
const cloudinary = require("cloudinary");

exports.signup = BigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!req.files) {
    return next(CustomError("photo is required for signup", 400));
  }

  if (!name || !email || !password) {
    return next(CustomError("Name, email, password are required", 400));
  }

  const file = req.files.photo;
  const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "lco/t-shirtStore/users",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secureUrl: result.secure_url,
    },
  });

  cookieToken(user, res);
});
