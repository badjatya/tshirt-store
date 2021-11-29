const router = require("express").Router();

// Controllers
const {
  addProduct,
  getAllProducts,
} = require("../controllers/productController");

// Middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// Admin
router.route("/add").post(isLoggedIn, customRole("admin"), addProduct);
router.route("/").get(isLoggedIn, getAllProducts);

module.exports = router;
