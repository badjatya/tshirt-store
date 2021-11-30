const router = require("express").Router();

// Controllers
const {
  adminAddProduct,
  getAllProducts,
  getSingleProduct,
  adminUpdateSingleProductDetails,
} = require("../controllers/productController");

// Middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// User
router.route("/").get(isLoggedIn, getAllProducts);
router.route("/:id").get(isLoggedIn, getSingleProduct);

// Admin
router.route("/add").post(isLoggedIn, customRole("admin"), adminAddProduct);
router
  .route("/:id")
  .get(isLoggedIn, customRole("admin"), getSingleProduct)
  .patch(isLoggedIn, customRole("admin"), adminUpdateSingleProductDetails);

module.exports = router;
