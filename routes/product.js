const router = require("express").Router();

// Controllers
const {} = require("../controllers/productController");

// Middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// router.route("/users").get(isLoggedIn, customRole("admin"), allUsers);

module.exports = router;
