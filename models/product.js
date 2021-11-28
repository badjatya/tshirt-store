const mongoose = require("mongoose");

// Library

const productSchema = new mongoose.Schema({});

module.exports = mongoose.model("Product", productSchema);
