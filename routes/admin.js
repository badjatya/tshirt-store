const router = require("express").Router();

// Controllers
const { adminAllUsers } = require("../controllers/adminController");

// Middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/users").get(isLoggedIn, customRole("admin"), adminAllUsers);

module.exports = router;
