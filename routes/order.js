const router = require("express").Router();

// Controllers
const {
  createOrder,
  getSingleOrder,
  getAllOrdersOfLoggedInUser,
} = require("../controllers/orderController");

// Middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// User
router.route("/create").post(isLoggedIn, createOrder);
router.route("/myOrder").get(isLoggedIn, getAllOrdersOfLoggedInUser);
router.route("/:id").get(isLoggedIn, getSingleOrder);

module.exports = router;
