const router = require("express").Router();

// Controllers
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);

module.exports = router;
