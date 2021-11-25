const router = require("express").Router();

// Controllers
const controller = require("../controllers/homeController");

// Route
router.route("/").get(controller.home);
router.route("/dummy").get(controller.dummy);

module.exports = router;
