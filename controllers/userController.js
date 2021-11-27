// Model
const User = require("../models/user");

// Utils
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const emailHelper = require("../utils/emailHelper");

// Lib
const cloudinary = require("cloudinary");
const crypto = require("crypto");

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

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking email & passwords are not empty
  if (!email || !password) {
    return next(CustomError("Email & Password are required", 400));
  }

  // Finding user in DB based on email
  const user = await User.findOne({ email });

  // If user not found
  if (!user) {
    return next(
      CustomError("Email or Password are incorrect or does not exists", 400)
    );
  }

  // Checking the password is correct or not
  const isPasswordCorrect = await user.isValidatedPassword(password);
  if (!isPasswordCorrect) {
    return next(
      CustomError("Email or Password are incorrect or does not exists", 400)
    );
  }

  cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
  // Clearing Cookie
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  // sending response
  res.status(200).json({
    status: "success",
    message: "User successfully logout",
  });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next("Email is required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next("User not found, try another email", 404);
  }

  const forgotToken = user.getForgotPasswordToken();

  // Save to DB
  await user.save({ validateBeforeSave: false });

  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/password/reset/${forgotToken}`;
  const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;

  try {
    emailHelper({
      email,
      subject: `T-Shirt Store, ${user.name} reset password`,
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Email sent successfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new CustomError("Email not sent, please try again after sometime", 500)
    );
  }
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const token = req.params.token;

  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: encryptedToken,
    forgotPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    new CustomError("token is invalid or expired", 401);
  }

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(
      new CustomError("password and confirmPassword does not match", 400)
    );
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenExpiry = undefined;

  await user.save();

  // Two options 1) send user token or redirect them to login page
  cookieToken(user, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
  req.user.password = undefined;
  res.status(200).json({
    status: "success",
    user: req.user,
  });
});

exports.updatePassword = BigPromise(async (req, res, next) => {
  const { password, oldPassword } = req.body;

  if (!password && !oldPassword) {
    return next(new CustomError("oldPassword and password is required", 400));
  }

  const isOldPassword = req.user.isValidatedPassword(oldPassword);

  if (!isOldPassword) {
    return next(new CustomError("oldPassword does not match", 400));
  }

  // Setting new password
  req.user.password = password;
  await req.user.save();

  cookieToken(req.user, res);
});

exports.updateProfile = BigPromise(async (req, res, next) => {
  const { name, email } = req.body;

  const newData = {
    name: name || req.user.name,
    email: email || req.user.email,
  };

  if (req.files) {
    // Deleting the existing photo from the database
    await cloudinary.v2.uploader.destroy(req.user.photo.id);

    // Uploading new image
    const file = req.files.photo;
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "lco/t-shirtStore/users",
      width: 150,
      crop: "scale",
    });

    newData.photo = {
      id: result.public_id,
      secureUrl: result.secure_url,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, newData, {
    new: true,
    runValidators: true,
  });

  updatedUser.password = undefined;

  res.status(200).json({
    status: "success",
    user: updatedUser,
  });
});
