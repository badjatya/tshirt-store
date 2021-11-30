const router = require("express").Router();

// Controllers
const {
  adminAddProduct,
  getAllProducts,
  getSingleProduct,
  adminUpdateSingleProductDetails,
  adminDeleteSingleProductDetails,
  addProductReview,
  deleteProductReview,
  getAllProductReviews,
} = require("../controllers/productController");

// Middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// User
router.route("/").get(isLoggedIn, getAllProducts);
router.route("/:id").get(isLoggedIn, getSingleProduct);
router.route("/review").post(isLoggedIn, addProductReview);
router
  .route("/review/:id")
  .delete(isLoggedIn, deleteProductReview)
  .get(isLoggedIn, getAllProductReviews);

// Admin
router.route("/add").post(isLoggedIn, customRole("admin"), adminAddProduct);
router
  .route("/:id")
  .get(isLoggedIn, customRole("admin"), getSingleProduct)
  .patch(isLoggedIn, customRole("admin"), adminUpdateSingleProductDetails)
  .delete(isLoggedIn, customRole("admin"), adminDeleteSingleProductDetails);

module.exports = router;
