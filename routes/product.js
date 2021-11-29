const router = require("express").Router();

// Controllers
const { addProduct } = require("../controllers/productController");

// Middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// Admin
router.route("/add").post(isLoggedIn, customRole("admin"), addProduct);

module.exports = router;
