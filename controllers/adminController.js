// Model
const User = require("../models/user");

// Utils
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");

// Lib
const cloudinary = require("cloudinary");

exports.allUsers = BigPromise(async (req, res, next) => {
  const users = await User.find({}).select("-password");

  res.status(200).json({
    status: "success",
    results: users.length,
    users,
  });
});

exports.singleUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.updateSingleUser = BigPromise(async (req, res, next) => {
  const { name, email, role } = req.body;

  const user = await User.findById(req.params.id);

  const newData = {
    name: name || user.name,
    email: email || user.email,
    role: role || user.role,
  };

  const updatedUser = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
  });

  updatedUser.password = undefined;

  res.status(200).json({
    status: "success",
    user: updatedUser,
  });
});

exports.deleteSingleUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  await cloudinary.v2.uploader.destroy(user.photo.id);
  await user.remove();

  res.status(200).json({
    status: "success",
    message: "user successfully deleted",
  });
});
