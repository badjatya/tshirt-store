const router = require("express").Router();

// Controllers
const { home } = require("../controllers/homeController");

// Route
router.route("/").get(home);

module.exports = router;
