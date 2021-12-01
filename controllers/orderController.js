// Model
const Product = require("../models/product");
const Order = require("../models/order");

// Utils
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");

exports.createOrder = BigPromise(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  if (
    !(
      shippingInfo ||
      orderItems ||
      paymentInfo ||
      taxAmount ||
      shippingAmount ||
      totalAmount
    )
  ) {
    return next(
      new CustomError(
        "An order must contain shippingInfo, orderItems, paymentInfo, taxAmount, shippingAmount and totalAmount",
        400
      )
    );
  }

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
    user: req.user._id,
  });

  res.status(201).json({
    status: "success",
    order,
  });
});
