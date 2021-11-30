const mongoose = require("mongoose");

// Library

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide product name"],
    trim: true,
    maxlength: [120, "Product name should not be more than 120 characters"],
  },
  price: {
    type: Number,
    required: [true, "please provide product price"],
    maxlength: [6, "price of product cant be more than 6 digits"],
  },
  description: {
    type: String,
    required: [true, "please provide product description"],
  },
  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secureUrl: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [
      true,
      "please select category from- shortSleeves, longSleeves, sweatShirts, hoodie",
    ],
    enum: {
      values: ["shortSleeves", "longSleeves", "sweatShirt", "hoodie"],
      message:
        "please select category ONLY from - shortSleeves, longSleeves, sweatShirts and hoodies ",
    },
  },
  stock: {
    type: Number,
    required: [true, "please add a number in stock"],
  },
  brand: {
    type: String,
    required: [true, "please add a brand for clothing"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
