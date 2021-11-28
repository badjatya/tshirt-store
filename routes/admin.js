const router = require("express").Router();

// Controllers
const {
  allUsers,
  singleUser,
  updateSingleUser,
} = require("../controllers/adminController");

// Middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/users").get(isLoggedIn, customRole("admin"), allUsers);
router
  .route("/users/:id")
  .get(isLoggedIn, customRole("admin"), singleUser)
  .patch(isLoggedIn, customRole("admin"), updateSingleUser);

module.exports = router;
