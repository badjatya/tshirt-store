const router = require("express").Router();

// Controllers
const { signup, login } = require("../controllers/userController");

router.route("/signup").post(signup);
router.route("/login").post(login);

module.exports = router;
