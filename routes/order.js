const router = require("express").Router();

// Controllers
const { createOrder } = require("../controllers/orderController");

// Middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/create").post(isLoggedIn, createOrder);

module.exports = router;
