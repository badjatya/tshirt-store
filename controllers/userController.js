// Model
const User = require("../models/user");

// Utils
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const emailHelper = require("../utils/emailHelper");

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
