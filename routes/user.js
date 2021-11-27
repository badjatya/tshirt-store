const router = require("express").Router();

// Controllers
const {
  signup,
  login,
  logout,
  forgotPassword,
} = require("../controllers/userController");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgot-password").post(forgotPassword);

module.exports = router;
