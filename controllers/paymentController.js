// Utils
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");

// Lib
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const razorpay = require("razorpay");

exports.getStripeKey = BigPromise(async (req, res, next) => {
  res.json({
    status: "success",
    stripeApi_keys: process.env.STRIPE_API_KEY,
  });
});

exports.captureStripePayment = BigPromise(async (req, res, next) => {
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    //optional
    metadata: { integration_check: "accept_a_payment" },
  });

  res.json({
    status: "success",
    clientSecret: paymentIntent.client_secret,
    amount: req.body.amount / 100,
  });
});

exports.getRazorpayKey = BigPromise(async (req, res, next) => {
  res.json({
    status: "success",
    razorpayApi_keys: process.env.RAZORPAY_API_KEY,
  });
});

exports.captureRazorpayPayment = BigPromise(async (req, res, next) => {
  const instance = new razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });

  var options = {
    amount: req.body.amount, // amount in the smallest currency unit
    currency: "INR",
  };
  const myOrder = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    amount: req.body.amount / 100,
    order: myOrder,
  });
});
