// Model

// Utils
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");

// Lib
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
  });
});
