const router = require("express").Router();

// Controllers
const { signup } = require("../controllers//userController");

router.route("/signup").post(signup);

module.exports = router;
