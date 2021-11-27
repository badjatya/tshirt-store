const router = require("express").Router();

// Controllers
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getLoggedInUserDetails,
  updatePassword,
  updateProfile,
} = require("../controllers/userController");

// Middleware
const { isLoggedIn } = require("../middlewares/user");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/profile").get(isLoggedIn, getLoggedInUserDetails);
router.route("/password/update").patch(isLoggedIn, updatePassword);
router.route("/profile/update").patch(isLoggedIn, updateProfile);

module.exports = router;
