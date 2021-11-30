const router = require("express").Router();

// Controllers
const {
  addProduct,
  getAllProducts,
  getSingleProduct,
} = require("../controllers/productController");

// Middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// User
router.route("/").get(isLoggedIn, getAllProducts);
router.route("/:id").get(isLoggedIn, getSingleProduct);

// Admin
router.route("/add").post(isLoggedIn, customRole("admin"), addProduct);

module.exports = router;
