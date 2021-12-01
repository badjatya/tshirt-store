const express = require("express");
const router = express.Router();
const {
  getStripeKey,
  captureStripePayment,
  getRazorpayKey,
  captureRazorpayPayment,
} = require("../controllers/paymentController");
const { isLoggedIn } = require("../middlewares/user");

router.route("/stripeKey").get(isLoggedIn, getStripeKey);
router.route("/razorpayKey").get(isLoggedIn, getRazorpayKey);

router.route("/captureStripe").post(isLoggedIn, captureStripePayment);
router.route("/captureRazorpay").post(isLoggedIn, captureRazorpayPayment);

module.exports = router;
