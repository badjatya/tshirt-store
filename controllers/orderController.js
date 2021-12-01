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

exports.getAllOrdersOfLoggedInUser = BigPromise(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    status: "success",
    user: {
      name: req.user.name,
      email: req.user.email,
    },
    totalOrder: orders.length,
    orders,
  });
});

exports.getSingleOrder = BigPromise(async (req, res, next) => {
  // const order = await Order.findById(req.params.id).populate(
  //     "user",
  //     "name email role"
  //   );

  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate("user", "name email role");

  if (!order) {
    return next(new CustomError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    order,
  });
});

exports.adminGetAllOrders = BigPromise(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    status: "success",
    user: {
      name: req.user.name,
      email: req.user.email,
    },
    totalOrder: orders.length,
    orders,
  });
});
