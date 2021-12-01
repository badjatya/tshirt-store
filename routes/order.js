const router = require("express").Router();

// Controllers
const {
  createOrder,
  getSingleOrder,
} = require("../controllers/orderController");

// Middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/create").post(isLoggedIn, createOrder);
router.route("/:id").get(isLoggedIn, getSingleOrder);

module.exports = router;
