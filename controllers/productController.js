// Model
const Product = require("../models/product");

// Utils
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const WhereClause = require("../utils/whereClause");

// Lib
const cloudinary = require("cloudinary");

exports.addProduct = BigPromise(async (req, res, next) => {
  // checking the images are present or not
  if (!req.files) {
    return next(new CustomError("A product must have photos", 400));
  }

  // Saving Photos
  let imageArray = [];
  // Uploading image based on single image or multiple image
  if (req.files.photos.length !== undefined) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "lco/t-shirtStore/products",
        }
      );

      imageArray.push({
        id: result.public_id,
        secureUrl: result.secure_url,
      });
    }
  } else {
    let result = await cloudinary.v2.uploader.upload(
      req.files.photos.tempFilePath,
      {
        folder: "lco/t-shirtStore/products",
      }
    );

    imageArray.push({
      id: result.public_id,
      secureUrl: result.secure_url,
    });
  }

  // Checking all this fields are present
  const { name, price, description, category, stock, brand } = req.body;
  if (!(name || price || description || category || stock || brand)) {
    return next(
      new CustomError(
        "Product must have name, price, description, category, stock, brand"
      )
    );
  }

  const product = await Product.create({
    name,
    price,
    description,
    category,
    stock,
    brand,
    photos: imageArray,
    user: req.user._id,
  });

  res.status(201).json({
    status: "success",
    product,
  });
});

exports.getAllProducts = BigPromise(async (req, res, next) => {
  let products = new WhereClause(Product.find(), req.query).search().filter();
  const totalProducts = await Product.countDocuments();
  const totalProductPerPage = 6;

  products.pager(totalProductPerPage);
  products = await products.base;

  res.status(200).json({
    status: "success",
    result: products.length,
    totalProducts,
    products,
  });
});
