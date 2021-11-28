const router = require("express").Router();

// Controllers
const { adminAllUsers } = require("../controllers/adminController");

// Middleware
const { isLoggedIn } = require("../middlewares/user");

router.route("/users").get(isLoggedIn, adminAllUsers);

module.exports = router;
